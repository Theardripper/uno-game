import { AppError } from "#shared/errors/AppError.js";
import { createDeck, drawCards, shuffleDeck } from "./game.deck.js";
import { canPlayCard } from "./game.rules.js";

class GameEngine {
    constructor() {
        /**
         * Armazena os estados das partidas em andamento
         * Map<roomCode, GameState>
         */
        this.activeGames = new Map();
    }

    /**
     * Retorna o estado atual da partida
     */
    getGame(roomCode) {
        return this.activeGames.get(roomCode);
    }

    /**
     * Registra uma ação no histórico da partida.
     */
    _logHistory(game, playerId, action, detail = {}) {
        game.history = game.history || [];
        game.history.push({
            player: playerId,
            action,
            ...detail,
            timestamp: new Date(),
        });
    }

    /**
     * Busca a partida em andamento, lançando erro se não existir ou já tiver acabado.
     */
    _getActiveGameOrThrow(roomCode) {
        const game = this.activeGames.get(roomCode);
        if (!game || game.status !== "in_progress") {
            throw new AppError("Partida não está em andamento", 400);
        }
        return game;
    }

    /**
     * Inicia uma partida a partir dos jogadores de uma sala
     */
    initializeGame(roomCode, roomPlayers) {
        let deck = shuffleDeck(createDeck());

        // Inicializa os jogadores com a mão vazia
        const players = roomPlayers.map((p) => ({
            id: p.id || p._id?.toString(),
            name: p.name,
            avatarSeed: p.avatarSeed || p.avatar_seed,
            hand: [],
            isConnected: true,
            saidUno: false,
        }));

        // Distribui 7 cartas para cada
        for (const player of players) {
            player.hand = drawCards(deck, 7);
        }

        // Vira a primeira carta
        let topCard = deck.pop();
        while (topCard.color === "wild") {
            // Se for curinga, coloca no meio do deck e pega outra
            deck.splice(Math.floor(deck.length / 2), 0, topCard);
            topCard = deck.pop();
        }

        const gameState = {
            roomCode,
            status: "in_progress",
            direction: "clockwise",
            players,
            deck,
            discardPile: [topCard],
            topCard,
            currentColor: topCard.color,
            currentTurn: players[0].id,
            turnIndex: 0,
            removedPlayers: [],
            history: [],
        };

        this.activeGames.set(roomCode, gameState);
        return gameState;
    }

    /**
     * Determina o próximo jogador (lidando com direção)
     */
    _getNextTurnIndex(game, steps = 1) {
        let nextIndex = game.turnIndex;
        const totalPlayers = game.players.length;

        if (game.direction === "clockwise") {
            nextIndex = (nextIndex + steps) % totalPlayers;
        } else {
            nextIndex = (nextIndex - steps) % totalPlayers;
            if (nextIndex < 0) {
                nextIndex += totalPlayers;
            }
        }
        return nextIndex;
    }

    /**
     * Calcula a pontuação final da partida e salva em game.matchScores.
     * Vencedor = Soma dos pontos das cartas dos oponentes.
     * Perdedores = Soma de suas próprias cartas.
     * W.O. = 0 pontos adicionais para o vencedor, base XP cuidará do ganho.
     */
    _calculateMatchScores(game) {
        if (game.status !== "finished") return;

        game.matchScores = {};
        let winnerScore = 0;

        const allPlayers = [...game.players, ...(game.removedPlayers || [])];

        for (const p of allPlayers) {
            let pScore = 0;
            // Soma o valor das cartas na mão do jogador
            for (const card of p.hand) {
                pScore += (card.score || 0);
            }

            if (p.id !== game.winnerId) {
                game.matchScores[p.id] = pScore; // Perdedor fica com o valor de sua mão
                winnerScore += pScore;
            }
        }

        if (game.winnerId) {
            game.matchScores[game.winnerId] = winnerScore;
        }
    }

    /**
     * Recicla a pilha de descarte se o deck acabar
     */
    _recycleDeckIfNeeded(game) {
        if (game.deck.length === 0 && game.discardPile.length > 1) {
            // Mantém apenas o topCard na mesa
            const topCard = game.discardPile.pop();
            const newDeck = shuffleDeck(game.discardPile);

            // Corrige cores alteradas dos Curingas para "wild" novamente, se necessário
            newDeck.forEach((c) => {
                if (c.value === "wild" || c.value === "wild_draw_four") {
                    c.color = "wild";
                }
            });

            game.deck = newDeck;
            game.discardPile = [topCard];
        }
    }

    /**
     * Ação: O jogador tenta comprar uma carta
     */
    drawCard(roomCode, playerId) {
        const game = this.activeGames.get(roomCode);
        if (!game || game.status !== "in_progress") throw new AppError("Partida não está em andamento", 400);
        if (game.currentTurn !== playerId) throw new AppError("Não é o seu turno", 400);

        this._recycleDeckIfNeeded(game);

        const drawn = drawCards(game.deck, 1);
        const player = game.players.find((p) => p.id === playerId);

        if (drawn.length > 0) {
            player.hand.push(...drawn);
        }

        // Comprar carta invalida uma declaração de UNO pendente
        player.saidUno = false;

        this._logHistory(game, playerId, "drew_card", { cardCount: drawn.length });

        // Passa o turno
        game.turnIndex = this._getNextTurnIndex(game, 1);
        game.currentTurn = game.players[game.turnIndex].id;

        return game;
    }

    /**
     * Ação: O jogador joga uma carta da sua mão
     */
    playCard(roomCode, playerId, cardId, selectedColor) {
        const game = this.activeGames.get(roomCode);
        if (!game || game.status !== "in_progress") throw new AppError("Partida não está em andamento", 400);
        if (game.currentTurn !== playerId) throw new AppError("Não é o seu turno", 400);

        const player = game.players.find((p) => p.id === playerId);
        const cardIndex = player.hand.findIndex((c) => c.id === cardId);

        if (cardIndex === -1) throw new AppError("Carta não encontrada na mão do jogador", 400);

        const cardToPlay = player.hand[cardIndex];

        // Validação da jogada
        if (!canPlayCard(cardToPlay, game.topCard, game.currentColor)) {
            throw new AppError("Jogada inválida! A carta não combina com a cor ou valor atual.", 400);
        }

        // Se for Wild, exige selectedColor
        if (cardToPlay.color === "wild" && !selectedColor) {
            throw new AppError("Você precisa escolher uma cor para a carta curinga", 400);
        }

        // 1. Remove da mão e joga na mesa
        player.hand.splice(cardIndex, 1);
        game.discardPile.push(cardToPlay);
        game.topCard = cardToPlay;
        game.currentColor = cardToPlay.color === "wild" ? selectedColor : cardToPlay.color;

        // Jogar uma carta muda a contagem da mão: invalida um UNO já declarado
        // (o jogador precisa dizer UNO de novo se ficar com 1 carta após esta jogada)
        player.saidUno = false;

        this._logHistory(game, playerId, "played_card", {
            card: { color: cardToPlay.color, value: cardToPlay.value },
        });

        // 2. Aplica efeitos da carta (Skip, Reverse, Draw)
        let stepsToAdvance = 1;
        let cardsToDrawForNext = 0;

        switch (cardToPlay.value) {
            case "reverse":
                // Se tiver apenas 2 jogadores, reverse funciona como skip
                if (game.players.length === 2) {
                    stepsToAdvance = 2;
                } else {
                    game.direction = game.direction === "clockwise" ? "counter_clockwise" : "clockwise";
                }
                break;
            case "skip":
                stepsToAdvance = 2;
                break;
            case "draw_two":
                cardsToDrawForNext = 2;
                stepsToAdvance = 2; // Pula o turno do jogador penalizado
                break;
            case "wild_draw_four":
                cardsToDrawForNext = 4;
                stepsToAdvance = 2; // Pula o turno do jogador penalizado
                break;
        }

        // Penalidades (Draw 2 / Draw 4)
        if (cardsToDrawForNext > 0) {
            const nextTurnIndex = this._getNextTurnIndex(game, 1);
            const nextPlayer = game.players[nextTurnIndex];

            for (let i = 0; i < cardsToDrawForNext; i++) {
                this._recycleDeckIfNeeded(game);
                const drawn = drawCards(game.deck, 1);
                if (drawn.length > 0) nextPlayer.hand.push(...drawn);
            }

            // A penalidade muda a contagem da mão do próximo jogador
            nextPlayer.saidUno = false;
        }

        // 3. Atualiza o turno
        game.turnIndex = this._getNextTurnIndex(game, stepsToAdvance);
        game.currentTurn = game.players[game.turnIndex].id;

        // 4. Verifica condição de vitória (Hand Vazia)
        if (player.hand.length === 0) {
            game.status = "finished";
            game.winnerId = player.id;
            game.endReason = "NORMAL";
            this._calculateMatchScores(game);
        }

        return game;
    }

    /**
     * Ação: O jogador declara "UNO" quando fica com exatamente 1 carta na mão.
     * Deve ser chamado como uma ação separada após jogar/comprar.
     */
    sayUno(roomCode, playerId) {
        const game = this._getActiveGameOrThrow(roomCode);

        const player = game.players.find((p) => p.id === playerId);
        if (!player) throw new AppError("Jogador não encontrado na partida", 404);

        if (player.hand.length !== 1) {
            throw new AppError("Só é possível dizer UNO quando você tem exatamente 1 carta na mão", 400);
        }

        player.saidUno = true;
        this._logHistory(game, playerId, "said_uno");

        return game;
    }

    /**
     * Ação: Um jogador desafia outro por não ter dito "UNO" a tempo.
     * Se o desafio for bem-sucedido, o desafiado compra 2 cartas de penalidade.
     */
    challengePlayer(roomCode, challengerId, challengedId) {
        const game = this._getActiveGameOrThrow(roomCode);

        const challenger = game.players.find((p) => p.id === challengerId);
        if (!challenger) throw new AppError("Jogador desafiante não encontrado na partida", 404);

        const challenged = game.players.find((p) => p.id === challengedId);
        if (!challenged) throw new AppError("Jogador desafiado não encontrado na partida", 404);

        if (challenged.hand.length !== 1) {
            throw new AppError("Não é possível desafiar: o jogador não está com uma única carta", 400);
        }

        if (challenged.saidUno) {
            this._logHistory(game, challengerId, "challenge_failed", { challenged: challengedId });
            return { game, success: false, message: `${challenged.name} disse UNO a tempo.` };
        }

        // Desafio bem-sucedido: desafiado compra 2 cartas de penalidade
        for (let i = 0; i < 2; i++) {
            this._recycleDeckIfNeeded(game);
            const drawn = drawCards(game.deck, 1);
            if (drawn.length > 0) challenged.hand.push(...drawn);
        }
        challenged.saidUno = false;

        this._logHistory(game, challengerId, "challenge_success", { challenged: challengedId });

        return { game, success: true, message: `${challenged.name} esqueceu de dizer UNO e comprou 2 cartas.` };
    }

    /**
     * Verifica se o jogador tem alguma carta jogável na mão, dado o estado
     * atual da mesa. Usado para decidir se ele é obrigado a comprar
     * (regra: "se não puder jogar, deve comprar do baralho").
     */
    hasValidMove(roomCode, playerId) {
        const game = this._getActiveGameOrThrow(roomCode);

        const player = game.players.find((p) => p.id === playerId);
        if (!player) throw new AppError("Jogador não encontrado na partida", 404);

        return player.hand.some((card) => canPlayCard(card, game.topCard, game.currentColor));
    }

    /**
     * Retorna a mão de um jogador específico (sem expor as mãos dos demais).
     */
    getPlayerHand(roomCode, playerId) {
        const game = this.activeGames.get(roomCode);
        if (!game) throw new AppError("Partida não encontrada", 404);

        const player = game.players.find((p) => p.id === playerId);
        if (!player) throw new AppError("Jogador não encontrado na partida", 404);

        return { roomCode, playerId, hand: player.hand };
    }

    /**
     * Retorna o histórico de jogadas da partida.
     */
    getHistory(roomCode) {
        const game = this.activeGames.get(roomCode);
        if (!game) throw new AppError("Partida não encontrada", 404);

        return { roomCode, history: game.history || [] };
    }

    /**
     * Retorna a pontuação corrente de cada jogador (soma dos pontos das cartas
     * ainda na mão). Quando a partida termina, usa o placar final calculado.
     */
    getScores(roomCode) {
        const game = this.activeGames.get(roomCode);
        if (!game) throw new AppError("Partida não encontrada", 404);

        if (game.status === "finished" && game.matchScores) {
            return { roomCode, scores: game.matchScores };
        }

        const scores = {};
        for (const p of game.players) {
            scores[p.id] = p.hand.reduce((sum, card) => sum + (card.score || 0), 0);
        }
        return { roomCode, scores };
    }

    /**
     * Gera o estado público para enviar via Broadcast (Oculta as mãos)
     */
    getPublicGameState(game) {
        const publicState = {
            roomCode: game.roomCode,
            status: game.status,
            direction: game.direction,
            topCard: game.topCard,
            currentColor: game.currentColor,
            currentTurn: game.currentTurn,
            deckCount: game.deck.length,
            players: game.players.map((p) => ({
                id: p.id,
                name: p.name,
                avatarSeed: p.avatarSeed,
                cardCount: p.hand.length,
                isConnected: p.isConnected,
                saidUno: p.saidUno,
            })),
        };

        if (game.status === "finished") {
            publicState.winnerId = game.winnerId;
            publicState.endReason = game.endReason;
        }

        return publicState;
    }

    /**
     * Remove um jogador da partida (ex: desconexão ou sair da partida)
     */
    removePlayer(roomCode, playerId, reason = "PLAYER_LEFT") {
        const game = this.activeGames.get(roomCode);
        if (!game || game.status !== "in_progress") return null;

        const playerIndex = game.players.findIndex((p) => p.id === playerId);
        if (playerIndex === -1) return null;

        // Remove o jogador
        const [removedPlayer] = game.players.splice(playerIndex, 1);
        game.removedPlayers = game.removedPlayers || [];
        game.removedPlayers.push(removedPlayer);

        if (game.players.length <= 1) {
            // Vitória por abandono
            game.status = "finished";
            game.winnerId = game.players.length === 1 ? game.players[0].id : null;
            game.endReason = reason;
            this._calculateMatchScores(game);
        } else {
            // Ajusta o turno se a partida continuar
            if (game.currentTurn === playerId) {
                // Era o turno de quem saiu
                if (game.direction === "clockwise") {
                    game.turnIndex = playerIndex % game.players.length;
                } else {
                    game.turnIndex = (playerIndex - 1 + game.players.length) % game.players.length;
                }
                game.currentTurn = game.players[game.turnIndex].id;
            } else {
                // Não era o turno de quem saiu, mas se ele estava antes, o índice do turno recua
                if (playerIndex < game.turnIndex) {
                    game.turnIndex--;
                }
            }
        }

        return game;
    }
}

// Exporta como Singleton para manter o estado persistente na memória da API
export const gameEngine = new GameEngine();