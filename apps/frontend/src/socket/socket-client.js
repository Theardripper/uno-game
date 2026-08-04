import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Singleton responsável por encapsular toda a comunicação com o Socket.IO.
 *
 * @author Isaac
 */
class SocketClient {
    constructor() {
        /**
         *  Instância única do Socket.IO.
         * A conexão só será iniciada quando o usuário possuir um JWT válido.
         */
        this.socket = io(SOCKET_URL, {
            autoConnect: false,

            transports: ["websocket", "polling"],

            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        if (process.env.NODE_ENV === "development") {
            this.registerDebugEvents();
        }
    }

    /**
     * Registra logs úteis apenas durante o desenvolvimento.
     */
    registerDebugEvents() {
        this.socket.on("connect", () => {
            console.log(`[Socket] Connected | id=${this.socket.id}`);
        });

        this.socket.on("disconnect", (reason) => {
            console.warn(`[Socket] Disconnected | reason=${reason}`);
        });

        this.socket.on("connect_error", (error) => {
            console.error("[Socket] Connection Error", error.message);
        });

        this.socket.io.on("reconnect_attempt", (attempt) => {
            console.log(`[Socket] Reconnect attempt #${attempt}`);
        });

        this.socket.io.on("reconnect", (attempt) => {
            console.log(`[Socket] Reconnected after ${attempt} attempts`);
        });

        this.socket.io.on("reconnect_error", (error) => {
            console.error("[Socket] Reconnect Error", error.message);
        });

        this.socket.io.on("reconnect_failed", () => {
            console.error("[Socket] Reconnect Failed");
        });
    }

    /**
     * Inicia a conexão autenticada.
     *
     * O JWT é enviado no e ficará disponível
     * no backend através de: socket.handshake.auth.token
     *
     * @param {string} token JWT do player autenticado.
     */
    connect(token) {

        if (!token)
            throw new Error("Socket connection requires a valid JWT token.");
        ;

        if (this.socket.connected || this.socket.active) return;

        this.socket.auth = { token };

        this.socket.connect();
    }

    /**
     * Encerra a conexão com o servidor.
     */
    disconnect() {

        if (!this.socket.connected) return;
        this.socket.disconnect();
    }

    /**
     * Remove todos os listeners registrados e encerra a conexão.
     * Útil para logout ou limpeza durante testes.
     */
    destroy() {

        this.socket.removeAllListeners();
        this.socket.disconnect();
    }

    /**
     * Encaminha um evento para o servidor.
     * Aceita qualquer assinatura suportada pelo Socket.IO.
     *
     * Ex:
     * emit(event)
     * emit(event, payload)
     * emit(event, payload, callback)
     */
    emit(...args) { this.socket.emit(...args); }

    /* Registra um listener. */
    on(...args) { this.socket.on(...args); }

    /* Registra um listener executado apenas uma vez. */
    once(...args) { this.socket.once(...args); }

    /* Remove um listener. */
    off(...args) { this.socket.off(...args); }

    /**
     * Remove todos os listeners.
     * Se um evento for informado, remove apenas daquele evento.
     *
     * @param {string} [event]
     */
    removeAllListeners(event) { this.socket.removeAllListeners(event); }

    /**
     * Indica se existe uma conexão ativa.
     * @returns {boolean}
     */
    isConnected() { return this.socket.connected; }

    /**
     * Indica se existe uma tentativa de conexão em andamento.
     * @returns {boolean}
     */
    isConnecting() { return this.socket.active && !this.socket.connected; }

    /**
     * Verifica se existe um token configurado
     * para autenticação do handshake.
     *
     * @returns {boolean}
     */
    isAuthenticated() { return Boolean(this.socket.auth?.token); }

    /**
     * ID atual da conexão.
     * Será undefined enquanto não conectar.
     */
    get id() { return this.socket.id; }
}

/**
 * Instância Singleton compartilhada por toda a aplicação.
 *
 * Nunca crie novos SocketClient().
 * Sempre utilize esta instância.
 */
export const socketClient = new SocketClient();
