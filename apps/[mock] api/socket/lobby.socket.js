import { SocketEvents } from "../../shared/socket/events.js";

import roomMock from "../mock/room.mock.js";

export default function registerLobbySocket(socket) {
    setTimeout(() => {
        socket.emit(SocketEvents.SERVER_ROOM_STATE, roomMock);
    }, 2000);
}
