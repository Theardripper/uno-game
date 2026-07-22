import { socketClient } from "@socket/socket-client";

import { useRoomStore } from "@/store/room/room.store";

import { SocketEvents } from "@shared/socket/events";

/**
 * Handler responsável pelo snapshot completo do Lobby.
 *
 * Evento: SERVER_ROOM_STATE
 *
 * Futuramente:
 * roomStore.setState(payload)
 */
export function registerRoomStateHandler() {

    console.log("Listening:", SocketEvents.SERVER_ROOM_STATE);

    const handler = (payload, acknowledgement) => {

        console.log("[Socket][Lobby] ROOM_STATE:", payload);

        useRoomStore
            .getState()
            .actions
            .setRoom(payload)
        ;

        acknowledgement?.();
    };

    socketClient.on(SocketEvents.SERVER_ROOM_STATE, handler);

    return () => socketClient.off(SocketEvents.SERVER_ROOM_STATE, handler);
}
