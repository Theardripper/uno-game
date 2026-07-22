import { io } from 'socket.io-client';

// Busca a URL do backend nas variáveis de ambiente, com fallback para localhost em desenvolvimento
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Instância única e global do cliente Socket.io (Singleton).
 * * Iniciamos com `autoConnect: false` por um motivo crucial de segurança:
 * Nós NÃO queremos que o Socket tente conectar no exato momento que a página carrega.
 * Precisamos esperar o Zustand carregar o Token JWT do usuário para injetá-lo antes de conectar.
 * * @type {import('socket.io-client').Socket}
 */
export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling'], // Dá prioridade ao WebSocket (menor latência)
    reconnection: true,                   // Se a internet cair, tenta voltar sozinho
    reconnectionAttempts: 5,              // Tenta 5 vezes antes de desistir
    reconnectionDelay: 1000,              // Espera 1 segundo entre cada tentativa
});

/**
 * Conecta o socket ao servidor usando o token de autenticação.
 * Deve ser chamado logo após o login ou quando o Zustand hidratar a store.
 * * @param {string} token - Token JWT do jogador (sessão)
 */
export const connectSocket = (token) => {
    console.log("[Socket Client]", {
        connected: socket.connected,
        active: socket.active,
        id: socket.id,
    });

    if (socket.connected) {
        console.warn("Já conectado");
        return;
    }

    socket.auth = { token };

    socket.connect();
};

/**
 * Desconecta o socket de forma segura.
 * Deve ser chamado quando o usuário sair da Sala.
 */
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// ==========================================
// 💡 Listeners Globais para Debugging
// ==========================================
// Esses eventos ajudam você a monitorar o estado da rede pelo console do navegador
if (process.env.NODE_ENV === 'development') {
    socket.on('connect', () => {
        console.log(`[Socket Client] Conectado com sucesso! ID: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
        console.warn(`[Socket Client] Desconectado. Motivo: ${reason}`);
    });

    socket.on('connect_error', (error) => {
        console.error(`[Socket Client] Erro de conexão: ${error.message}`);
    });
}
