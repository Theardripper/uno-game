import { api } from "@/api/client";

export const roomService = {
  createRoom: async (data = {}) => {
    return api.post("rooms", { json: data }).json();
  },

  joinRoom: async (roomCode) => {
    return api.post("rooms/join", { json: { roomCode } }).json();
  },

  getRoom: async (roomCode) => {
    return api.get(`rooms/${roomCode}`).json();
  }
};
