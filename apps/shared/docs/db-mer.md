///////////////////////////////////////////////////////////
// ENUMS
///////////////////////////////////////////////////////////

Enum room_status {
waiting // Sala aguardando jogadores no lobby
playing // Partida em andamento
finished // Partida finalizada, sala encerrada
}

Enum game_status {
starting // Host iniciou: inicializando regras e validando jogadores
dealing // Embaralhando e distribuindo cartas iniciais
in_progress // Partida em andamento
paused // Pausada (ex: aguardando reconexão de jogador)
round_finished // Rodada encerrada, mostrando placar
finished // Partida encerrada (vencedor definido)
cancelled // Partida abortada (ex: todos desconectaram)
}

Enum game_direction {
clockwise // Sentido horário
counter_clockwise // Sentido anti-horário
}

Enum turn_phase {
play_or_draw // Jogador deve jogar uma carta ou comprar
drawn_card_decision // Jogador comprou e decide se joga a carta comprada
choose_color // Jogador deve escolher uma cor (Wild/Wild+4)
challenge_pending // Próximo jogador decide se desafia o +4
}

Enum event_type {
GAME_STARTED
GAME_FINISHED
GAME_CANCELLED
ROUND_STARTED
ROUND_FINISHED
TURN_CHANGED
PLAY_CARD
DRAW_CARD
PASS_TURN
CHOOSE_COLOR
CALL_UNO
CATCH_UNO
CHALLENGE_DRAW_FOUR
CHALLENGE_RESULT
PLAYER_PENALIZED
PLAYER_DISCONNECTED
PLAYER_RECONNECTED
PLAYER_FORFEITED
}

Enum room_player_role {
player // Participante ativo da partida
spectator // Apenas assistindo
}

Enum connection_status {
connected // Conectado via WebSocket
disconnected // Conexão perdida, aguardando reconexão
}

///////////////////////////////////////////////////////////
// PLAYERS
///////////////////////////////////////////////////////////

Table players {
id uuid [pk, default: `gen_random_uuid()`] // Identificador único do jogador
name varchar(100) [not null] // Nome de exibição do jogador
email varchar(255) [unique, null] // E-mail p/ login (null para convidados)
password_hash varchar(255) [null] // Senha criptografada com bcrypt/argon2 (null para convidados)
avatar_seed varchar(255) [not null] // Seed utilizada para gerar o avatar deterministicamente
is_guest boolean [not null, default: false] // Indica se o jogador é um visitante (Guest)
is_bot boolean [not null, default: false] // Indica se é um jogador controlado por IA
bot_difficulty varchar(20) [null] // Nível de dificuldade do bot: 'easy', 'medium', 'hard' (null se não for bot)
last_active_at timestamptz [null] // Última atividade (para limpeza de contas guest e status online)
created_at timestamptz [not null, default: `now()`] // Data de criação da conta
updated_at timestamptz [not null, default: `now()`] // Data da última atualização
deleted_at timestamptz [null] // Data da exclusão lógica (Soft Delete)

indexes {
deleted_at [note: 'Partial index: WHERE deleted_at IS NULL']
is_guest [note: 'Partial index: WHERE is_guest = true AND deleted_at IS NULL (limpeza de guests)']
}

Note: 'CHECK: bot_difficulty IN (\'easy\', \'medium\', \'hard\') OR bot_difficulty IS NULL'
}

///////////////////////////////////////////////////////////
// PLAYER STATS (Estatísticas agregadas - isoladas do players)
///////////////////////////////////////////////////////////

Table player_stats {
player_id uuid [pk] // FK → players (relação 1:1)
total_games int [not null, default: 0] // Total de partidas jogadas
total_wins int [not null, default: 0] // Total de vitórias
total_losses int [not null, default: 0] // Total de derrotas
win_rate decimal(5,2) [not null, default: 0] // Percentual de vitórias
total_cards_played int [not null, default: 0] // Total de cartas jogadas na carreira
total_cards_drawn int [not null, default: 0] // Total de cartas compradas na carreira
total_uno_calls int [not null, default: 0] // Total de declarações de UNO
current_win_streak int [not null, default: 0] // Sequência de vitórias atual
best_win_streak int [not null, default: 0] // Maior sequência de vitórias
rating int [not null, default: 1000] // Rating ELO/Glicko-2 para matchmaking futuro
updated_at timestamptz [not null, default: `now()`] // Última atualização das stats

Note: 'CHECK: total_games >= 0, total_wins >= 0, total_losses >= 0, win_rate BETWEEN 0 AND 100, rating >= 0'
}

///////////////////////////////////////////////////////////
// REFRESH TOKENS (JWT - tokens armazenados como hash)
///////////////////////////////////////////////////////////

Table refresh_tokens {
id uuid [pk, default: `gen_random_uuid()`] // Identificador único do token
player_id uuid [not null] // Jogador proprietário do token
token_hash varchar(64) [not null] // SHA-256 hash do Refresh Token (nunca armazenar em texto plano)
expires_at timestamptz [not null] // Data de expiração do Refresh Token
revoked_at timestamptz [null] // Data de revogação (null = ativo)
replaced_by_token_id uuid [null] // ID do token que substituiu este (detecção de reuso)
user_agent text [null] // User-Agent do dispositivo que criou o token
ip_address varchar(45) [null] // IP do dispositivo (IPv6 = 45 chars max)
created_at timestamptz [not null, default: `now()`] // Data de criação do token

indexes {
token_hash [unique] // Busca rápida por hash do token
player_id [note: 'FK index — PostgreSQL não cria automaticamente']
expires_at [note: 'Cleanup job: DELETE WHERE expires_at < NOW() AND revoked_at IS NULL']
}

Note: 'Tokens expirados/revogados são limpos por um job periódico'
}

///////////////////////////////////////////////////////////
// ROOMS (Lobby / Salas de Espera)
///////////////////////////////////////////////////////////

Table rooms {
id uuid [pk, default: `gen_random_uuid()`] // Identificador interno da sala
code varchar(20) [unique, not null] // Código compartilhável da sala (Ex: UNO-A1B2)
host_id uuid [not null] // Jogador que é o Host da sala (fonte única de verdade)
min_players int [not null, default: 2] // Mínimo de jogadores para iniciar
max_players int [not null, default: 4] // Máximo de jogadores permitidos
is_private boolean [not null, default: false] // Indica se a sala é privada
password_hash varchar(255) [null] // Senha bcrypt da sala (somente se is_private = true)
status room_status [not null, default: 'waiting'] // Estado atual da sala
created_at timestamptz [not null, default: `now()`] // Data de criação
updated_at timestamptz [not null, default: `now()`] // Data da última atualização

indexes {
host_id [note: 'FK index']
status [note: 'Partial index: WHERE status = \'waiting\' (listagem do lobby)']
}

Note: 'CHECK: min_players BETWEEN 2 AND 10, max_players BETWEEN 2 AND 10, min_players <= max_players'
}

///////////////////////////////////////////////////////////
// ROOM PLAYERS (Quem está na sala)
///////////////////////////////////////////////////////////

Table room_players {
room_id uuid [not null] // Sala onde o jogador está
player_id uuid [not null] // Jogador participante da sala
role room_player_role [not null, default: 'player'] // Papel: jogador ativo ou espectador
is_ready boolean [not null, default: false] // Indica se o jogador está pronto para iniciar
connection_status connection_status [not null, default: 'connected'] // Estado da conexão WebSocket
joined_at timestamptz [not null, default: `now()`] // Momento em que entrou na sala

indexes {
(room_id, player_id) [pk] // Chave primária composta (sem surrogate UUID)
player_id [unique, note: 'Impede jogador em múltiplas salas simultaneamente']
}
}

///////////////////////////////////////////////////////////
// GAMES (Registro histórico da partida — escrito ao finalizar)
///////////////////////////////////////////////////////////

Table games {
id uuid [pk, default: `gen_random_uuid()`] // Identificador da partida
room_id uuid [not null] // Sala que originou a partida
previous_game_id uuid [null] // Partida anterior (cadeia de rematches, null se primeira)
winner_player_id uuid [null] // Jogador vencedor geral (null enquanto in_progress)
status game_status [not null, default: 'starting'] // Estado atual/final da partida
game_type varchar(20) [not null, default: 'casual'] // Tipo: 'casual', 'ranked', 'tournament'
total_rounds int [not null, default: 0] // Quantidade total de rodadas disputadas
started_at timestamptz [not null, default: `now()`] // Data de início da partida
finished_at timestamptz [null] // Data de término da partida (null enquanto in_progress)
duration_seconds int [null] // Duração total da partida em segundos (cache de finished_at - started_at)

indexes {
room_id [note: 'FK index — buscar partidas de uma sala']
winner_player_id [note: 'FK index']
previous_game_id [note: 'FK index — cadeia de rematches']
status [note: 'Partial index: WHERE status = \'in_progress\' (reconexão pós-restart)']
started_at [note: 'Ordenação cronológica para histórico']
}

Note: 'CHECK: game_type IN (\'casual\', \'ranked\', \'tournament\'), total_rounds >= 0, duration_seconds >= 0 OR duration_seconds IS NULL'
}

///////////////////////////////////////////////////////////
// GAME SETTINGS (Configurações e House Rules da partida)
///////////////////////////////////////////////////////////

Table game_settings {
game_id uuid [pk] // FK → games (relação 1:1)
allow_stacking boolean [not null, default: false] // Permitir empilhar +2 sobre +2 e +4 sobre +4
allow_jump_in boolean [not null, default: false] // Permitir jogar carta idêntica fora do turno
draw_until_playable boolean [not null, default: false] // Comprar até encontrar carta jogável (em vez de 1)
seven_zero_rule boolean [not null, default: false] // 7 = trocar mão com outro jogador, 0 = rotacionar mãos
force_play boolean [not null, default: true] // Obrigar a jogar a carta comprada se for válida
turn_time_limit_seconds int [not null, default: 30] // Limite de tempo por turno em segundos
max_rounds int [not null, default: 1] // Quantidade máxima de rodadas (1 = partida rápida)
points_to_win int [not null, default: 500] // Pontuação para vencer (se max_rounds > 1)
reconnect_grace_period_seconds int [not null, default: 60] // Tempo de espera para reconexão antes de forfeit

Note: 'CHECK: turn_time_limit_seconds BETWEEN 10 AND 120, max_rounds BETWEEN 1 AND 20, points_to_win BETWEEN 100 AND 2000, reconnect_grace_period_seconds BETWEEN 15 AND 300'
}

///////////////////////////////////////////////////////////
// ROUNDS (Rodadas dentro de uma partida multi-rodada)
///////////////////////////////////////////////////////////

Table rounds {
id uuid [pk, default: `gen_random_uuid()`] // Identificador da rodada
game_id uuid [not null] // FK → games
round_number int [not null] // Número sequencial da rodada (1, 2, 3...)
winner_player_id uuid [null] // Vencedor desta rodada (null se cancelada)
started_at timestamptz [not null, default: `now()`] // Início da rodada
finished_at timestamptz [null] // Fim da rodada (null se in_progress)

indexes {
(game_id, round_number) [unique] // Garantia de unicidade da rodada dentro da partida
game_id [note: 'FK index']
winner_player_id [note: 'FK index']
}

Note: 'CHECK: round_number >= 1'
}

///////////////////////////////////////////////////////////
// ROUND PLAYERS (Desempenho por jogador por rodada)
///////////////////////////////////////////////////////////

Table round_players {
round_id uuid [not null] // FK → rounds
player_id uuid [not null] // FK → players
points_earned int [not null, default: 0] // Pontos ganhos nesta rodada (cartas dos perdedores)
cards_remaining int [not null, default: 0] // Cartas restantes quando a rodada terminou
cards_played int [not null, default: 0] // Cartas jogadas nesta rodada
cards_drawn int [not null, default: 0] // Cartas compradas nesta rodada
uno_calls int [not null, default: 0] // Vezes que declarou UNO com sucesso nesta rodada
penalties_received int [not null, default: 0] // Penalidades recebidas nesta rodada

indexes {
(round_id, player_id) [pk] // Chave primária composta
player_id [note: 'FK index']
}

Note: 'CHECK: points_earned >= 0, cards_remaining >= 0, cards_played >= 0, cards_drawn >= 0'
}

///////////////////////////////////////////////////////////
// GAME PLAYERS (Resumo agregado do desempenho na partida completa)
///////////////////////////////////////////////////////////

Table game_players {
game_id uuid [not null] // Partida em que participou
player_id uuid [not null] // Jogador participante
turn_order int [not null] // Ordem de jogada durante a partida (posição na mesa)
final_position int [null] // Colocação final (1º, 2º, 3º lugar — null se in_progress)
total_points int [not null, default: 0] // Pontuação total acumulada (soma de todas as rodadas)
total_cards_played int [not null, default: 0] // Total de cartas jogadas em todas as rodadas
total_cards_drawn int [not null, default: 0] // Total de cartas compradas em todas as rodadas
total_uno_calls int [not null, default: 0] // Total de declarações de UNO em todas as rodadas
connection_status connection_status [not null, default: 'connected'] // Estado ao final da partida

indexes {
(game_id, player_id) [pk] // Chave primária composta (sem surrogate UUID)
player_id [note: 'FK index — "meu histórico de partidas"']
(game_id, turn_order) [note: 'Iteração por ordem de turno durante o jogo']
}

Note: 'CHECK: turn_order >= 0, total_points >= 0, total_cards_played >= 0, total_cards_drawn >= 0'
}

///////////////////////////////////////////////////////////
// GAME EVENTS (Logs de Replay / Auditoria — append-only)
///////////////////////////////////////////////////////////

Table game_events {
id uuid [pk, default: `gen_random_uuid()`] // Identificador do evento
game_id uuid [not null] // Partida a que pertence
round_id uuid [null] // Rodada a que pertence (null para eventos de nível game, ex: GAME_STARTED)
player_id uuid [null] // Jogador responsável (null para eventos do sistema)
sequence_number int [not null] // Número sequencial dentro da partida (ordenação determinística)
type event_type [not null] // Tipo do evento
payload jsonb [not null, default: '{}'] // Dados específicos do evento (JSONB para indexação)
created_at timestamptz [not null, default: `now()`] // Momento em que ocorreu

indexes {
(game_id, sequence_number) [unique] // Ordenação determinística e anti-colisão
(game_id, created_at) [note: 'Replay cronológico']
(game_id, type) [note: 'Filtragem por tipo de evento (analytics)']
round_id [note: 'FK index — eventos de uma rodada']
player_id [note: 'FK index — eventos de um jogador']
}

Note: 'CHECK: sequence_number >= 1. Tabela append-only. Considerar particionamento por RANGE(created_at) mensal em produção.'
}

///////////////////////////////////////////////////////////
// RELATIONSHIPS
///////////////////////////////////////////////////////////

// --- Players ---
Ref: player_stats.player_id - players.id [delete: cascade] // 1:1 — stats deletam junto com o player
Ref: refresh_tokens.player_id > players.id [delete: cascade] // Tokens morrem com o player

// --- Rooms ---
Ref: rooms.host_id > players.id [delete: restrict] // Não deletar player que é host ativo
Ref: room_players.room_id > rooms.id [delete: cascade] // Sala deletada → limpar room_players
Ref: room_players.player_id > players.id [delete: cascade] // Player deletado → sai da sala

// --- Games ---
Ref: games.room_id > rooms.id [delete: restrict] // Não deletar sala com histórico de partida
Ref: games.previous_game_id > games.id [delete: set null] // Rematch chain — se original for deletado, manter
Ref: games.winner_player_id > players.id [delete: set null] // Player deletado → vencedor fica null
Ref: game_settings.game_id - games.id [delete: cascade] // 1:1 — settings deletam com o game

// --- Rounds ---
Ref: rounds.game_id > games.id [delete: cascade] // Game deletado → rodadas deletadas
Ref: rounds.winner_player_id > players.id [delete: set null]
Ref: round_players.round_id > rounds.id [delete: cascade]
Ref: round_players.player_id > players.id [delete: restrict] // Não deletar player com histórico

// --- Game Players ---
Ref: game_players.game_id > games.id [delete: cascade] // Game deletado → game_players limpos
Ref: game_players.player_id > players.id [delete: restrict] // Não deletar player com histórico

// --- Game Events ---
Ref: game_events.game_id > games.id [delete: cascade] // Game deletado → eventos deletados
Ref: game_events.round_id > rounds.id [delete: set null] // Round deletado → manter evento
Ref: game_events.player_id > players.id [delete: set null] // Player deletado → manter evento anônimo

// --- Refresh Tokens (self-ref) ---
Ref: refresh_tokens.replaced_by_token_id > refresh_tokens.id [delete: set null]
