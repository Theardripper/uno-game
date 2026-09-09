import { api } from "@/api/client";

export const roomService = {
  createRoom: async (data = {}) => {
    return api.post("rooms", { json: { isPrivate: true, ...data } }).json();
  },

  joinRoom: async (roomCode) => {
    return api.post("rooms/join", { json: { roomCode } }).json();
  },

  getRoom: async (roomCode) => {
    return api.get(`rooms/${roomCode}`).json();
  },

  getPublicRooms: async () => {
    return api.get("rooms/public").json();
  },

  updateRoom: async (roomId, data) => {
    return api.patch(`rooms/${roomId}`, { json: data }).json();
  }
};
