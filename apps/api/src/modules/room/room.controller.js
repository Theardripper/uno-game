import * as roomService from './room.service.js';
import { success } from '#shared/helpers/response.js';

export const createRoom = async (req, res, next) => {
    try {
        const room = await roomService.createRoom(req.user.id, req.body);
        return success(res, { room }, 'Sala criada com sucesso', 201);
    } catch (error) {
        next(error);
    }
};

export const validateRoomCode = async (req, res, next) => {
    try {
        const room = await roomService.validateRoomCode(req.params.code);
        return success(res, { room, canJoin: true }, 'Sala válida para entrar', 200);
    } catch (error) {
        next(error);
    }
};

export const getRoomByCode = async (req, res, next) => {
    try {
        const room = await roomService.getRoomByCode(req.params.code);
        return success(res, { room }, 'Sala recuperada com sucesso', 200);
    } catch (error) {
        next(error);
    }
};

export const joinRoom = async (req, res, next) => {
    try {
        const room = await roomService.joinRoom(req.body.roomCode, req.user.id);
        return success(res, { room }, 'Entrou na sala com sucesso', 200);
    } catch (error) {
        next(error);
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const room = await roomService.updateRoom(req.params.id, req.user.id, req.body);
        return success(res, { room }, 'Sala atualizada com sucesso', 200);
    } catch (error) {
        next(error);
    }
};

export const deleteRoom = async (req, res, next) => {
    try {
        await roomService.deleteRoom(req.params.id, req.user.id);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
