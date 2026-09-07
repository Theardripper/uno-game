import { jest } from '@jest/globals';

const RoomMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
};

const PlayerMock = {
    find: jest.fn(),
};

class AppErrorMock extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

jest.unstable_mockModule('./room.model.js', () => ({ default: RoomMock }));
jest.unstable_mockModule('../player/player.model.js', () => ({ default: PlayerMock }));
jest.unstable_mockModule('#shared/errors/AppError.js', () => ({ AppError: AppErrorMock }));

const roomService = await import('./room.service.js');

beforeEach(() => {
    jest.clearAllMocks();
});

// ===================== createRoom =====================
describe('RoomService - createRoom', () => {
    it('deve gerar um código no formato UNO- seguido de quatro caracteres', async () => {
        RoomMock.create.mockResolvedValue({ _id: 'r1' });

        await roomService.createRoom('user123', {});

        const calledWith = RoomMock.create.mock.calls[0][0];
        expect(calledWith.code).toMatch(/^UNO-[A-Z0-9]{4}$/);
    });

    it('deve usar os valores padrão quando o body não informar as configurações da sala', async () => {
        RoomMock.create.mockResolvedValue({ _id: 'r1' });

        await roomService.createRoom('user123', {});

        const calledWith = RoomMock.create.mock.calls[0][0];
        expect(calledWith.maxPlayers).toBe(4);
        expect(calledWith.isPrivate).toBe(false);
        expect(calledWith.password).toBeNull();
    });

    it('deve respeitar as configurações informadas no body', async () => {
        RoomMock.create.mockResolvedValue({ _id: 'r1' });

        await roomService.createRoom('user123', { maxPlayers: 6, isPrivate: true, password: '1234' });

        const calledWith = RoomMock.create.mock.calls[0][0];
        expect(calledWith.maxPlayers).toBe(6);
        expect(calledWith.isPrivate).toBe(true);
        expect(calledWith.password).toBe('1234');
    });

    it('deve registrar o host como primeiro jogador da sala', async () => {
        RoomMock.create.mockResolvedValue({ _id: 'r1' });

        await roomService.createRoom('user123', {});

        const calledWith = RoomMock.create.mock.calls[0][0];
        expect(calledWith.hostId).toBe('user123');
        expect(calledWith.players).toEqual(['user123']);
    });
});

// ===================== validateRoomCode =====================
describe('RoomService - validateRoomCode', () => {
    it('deve devolver a sala quando ela existir, estiver aguardando e tiver vaga', async () => {
        const fakeRoom = { code: 'UNO-A1B2', status: 'waiting', players: ['user123'], maxPlayers: 4 };
        RoomMock.findOne.mockResolvedValue(fakeRoom);

        const result = await roomService.validateRoomCode('UNO-A1B2');

        expect(RoomMock.findOne).toHaveBeenCalledWith({ code: 'UNO-A1B2' });
        expect(result).toBe(fakeRoom);
    });

    it('deve lançar erro 404 quando a sala não existir', async () => {
        RoomMock.findOne.mockResolvedValue(null);

        await expect(roomService.validateRoomCode('UNO-XXXX')).rejects.toMatchObject({
            errorCode: 'ROOM_NOT_FOUND',
            statusCode: 404,
        });
    });

    it('deve lançar erro 409 quando o jogo já tiver sido iniciado', async () => {
        RoomMock.findOne.mockResolvedValue({ status: 'playing', players: [], maxPlayers: 4 });

        await expect(roomService.validateRoomCode('UNO-A1B2')).rejects.toMatchObject({
            errorCode: 'GAME_ALREADY_STARTED',
            statusCode: 409,
        });
    });

    it('deve lançar erro 409 quando a sala já estiver cheia', async () => {
        RoomMock.findOne.mockResolvedValue({
            status: 'waiting',
            players: ['u1', 'u2', 'u3', 'u4'],
            maxPlayers: 4,
        });

        await expect(roomService.validateRoomCode('UNO-A1B2')).rejects.toMatchObject({
            errorCode: 'ROOM_FULL',
            statusCode: 409,
        });
    });
});

// ===================== getRoomByCode =====================
describe('RoomService - getRoomByCode', () => {
    it('deve devolver a sala com os detalhes formatados dos jogadores', async () => {
        const fakeRoom = { code: 'UNO-A1B2', players: ['p1'] };
        RoomMock.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(fakeRoom) });
        PlayerMock.find.mockResolvedValue([
            { _id: 'p1', name: 'João', tag: '1234', avatar_seed: 'abc', level: 3 },
        ]);

        const result = await roomService.getRoomByCode('UNO-A1B2');

        expect(PlayerMock.find).toHaveBeenCalledWith({ _id: { $in: ['p1'] } });
        expect(result.playerDetails).toHaveLength(1);
        expect(result.playerDetails[0]).toEqual({
            id: 'p1',
            name: 'João',
            tag: '1234',
            avatarSeed: 'https://api.dicebear.com/9.x/avataaars/svg?seed=abc',
            level: 3,
            ready: false,
        });
    });

    it('deve lançar erro 404 quando a sala não existir', async () => {
        RoomMock.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

        await expect(roomService.getRoomByCode('UNO-XXXX')).rejects.toMatchObject({
            errorCode: 'ROOM_NOT_FOUND',
            statusCode: 404,
        });
    });

    it('deve devolver uma lista vazia de detalhes quando a sala não tiver jogadores', async () => {
        RoomMock.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ code: 'UNO-A1B2', players: [] }) });
        PlayerMock.find.mockResolvedValue([]);

        const result = await roomService.getRoomByCode('UNO-A1B2');

        expect(result.playerDetails).toEqual([]);
    });
});

// ===================== joinRoom =====================
describe('RoomService - joinRoom', () => {
    it('deve adicionar o jogador na sala e salvar a alteração', async () => {
        const save = jest.fn();
        const fakeRoom = { status: 'waiting', players: ['u1'], maxPlayers: 4, save };
        RoomMock.findOne.mockResolvedValue(fakeRoom);

        const result = await roomService.joinRoom('UNO-A1B2', 'u2');

        expect(fakeRoom.players).toEqual(['u1', 'u2']);
        expect(save).toHaveBeenCalledTimes(1);
        expect(result).toBe(fakeRoom);
    });

    it('deve devolver a sala sem salvar quando o jogador já estiver dentro dela', async () => {
        const save = jest.fn();
        const fakeRoom = { status: 'waiting', players: ['u1'], maxPlayers: 4, save };
        RoomMock.findOne.mockResolvedValue(fakeRoom);

        const result = await roomService.joinRoom('UNO-A1B2', 'u1');

        expect(fakeRoom.players).toEqual(['u1']);
        expect(save).not.toHaveBeenCalled();
        expect(result).toBe(fakeRoom);
    });

    it('deve lançar erro 404 quando a sala não existir', async () => {
        RoomMock.findOne.mockResolvedValue(null);

        await expect(roomService.joinRoom('UNO-XXXX', 'u1')).rejects.toMatchObject({
            errorCode: 'ROOM_NOT_FOUND',
            statusCode: 404,
        });
    });

    it('deve lançar erro 409 quando o jogo já tiver sido iniciado', async () => {
        RoomMock.findOne.mockResolvedValue({ status: 'playing', players: [], maxPlayers: 4 });

        await expect(roomService.joinRoom('UNO-A1B2', 'u1')).rejects.toMatchObject({
            errorCode: 'GAME_ALREADY_STARTED',
            statusCode: 409,
        });
    });

    it('deve lançar erro 409 quando a sala já estiver cheia', async () => {
        RoomMock.findOne.mockResolvedValue({
            status: 'waiting',
            players: ['u1', 'u2', 'u3', 'u4'],
            maxPlayers: 4,
        });

        await expect(roomService.joinRoom('UNO-A1B2', 'u5')).rejects.toMatchObject({
            errorCode: 'ROOM_FULL',
            statusCode: 409,
        });
    });
});

// ===================== updateRoom =====================
describe('RoomService - updateRoom', () => {
    it('deve atualizar apenas os campos informados e salvar a sala', async () => {
        const save = jest.fn();
        const fakeRoom = { hostId: 'u1', maxPlayers: 4, isPrivate: false, password: null, save };
        RoomMock.findById.mockResolvedValue(fakeRoom);

        const result = await roomService.updateRoom('r1', 'u1', { maxPlayers: 6 });

        expect(fakeRoom.maxPlayers).toBe(6);
        expect(fakeRoom.isPrivate).toBe(false);
        expect(save).toHaveBeenCalledTimes(1);
        expect(result).toBe(fakeRoom);
    });

    it('deve lançar erro 404 quando a sala não existir', async () => {
        RoomMock.findById.mockResolvedValue(null);

        await expect(roomService.updateRoom('r1', 'u1', {})).rejects.toMatchObject({
            errorCode: 'ROOM_NOT_FOUND',
            statusCode: 404,
        });
    });

    it('deve lançar erro 403 quando quem pediu a alteração não for o host', async () => {
        RoomMock.findById.mockResolvedValue({ hostId: 'u1', save: jest.fn() });

        await expect(roomService.updateRoom('r1', 'u999', {})).rejects.toMatchObject({
            errorCode: 'UNAUTHORIZED',
            statusCode: 403,
        });
    });
});

// ===================== deleteRoom =====================
describe('RoomService - deleteRoom', () => {
    it('deve remover a sala e devolver true', async () => {
        const deleteOne = jest.fn();
        RoomMock.findById.mockResolvedValue({ hostId: 'u1', deleteOne });

        const result = await roomService.deleteRoom('r1', 'u1');

        expect(deleteOne).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });

    it('deve lançar erro 404 quando a sala não existir', async () => {
        RoomMock.findById.mockResolvedValue(null);

        await expect(roomService.deleteRoom('r1', 'u1')).rejects.toMatchObject({
            errorCode: 'ROOM_NOT_FOUND',
            statusCode: 404,
        });
    });

    it('deve lançar erro 403 quando quem pediu a exclusão não for o host', async () => {
        const deleteOne = jest.fn();
        RoomMock.findById.mockResolvedValue({ hostId: 'u1', deleteOne });

        await expect(roomService.deleteRoom('r1', 'u999')).rejects.toMatchObject({
            errorCode: 'UNAUTHORIZED',
            statusCode: 403,
        });
        expect(deleteOne).not.toHaveBeenCalled();
    });
});

// ===================== leaveRoom =====================
describe('RoomService - leaveRoom', () => {
    it('deve remover o jogador da sala e salvar a alteração', async () => {
        const save = jest.fn();
        const fakeRoom = { code: 'UNO-A1B2', hostId: 'u1', players: ['u1', 'u2'], save };
        RoomMock.findOne
            .mockResolvedValueOnce(fakeRoom)
            .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue({ code: 'UNO-A1B2', players: ['u1'] }) });
        PlayerMock.find.mockResolvedValue([]);

        await roomService.leaveRoom('UNO-A1B2', 'u2');

        expect(fakeRoom.players).toEqual(['u1']);
        expect(save).toHaveBeenCalledTimes(1);
    });

    it('deve transferir o host para o jogador seguinte quando o host sair', async () => {
        const save = jest.fn();
        const fakeRoom = { code: 'UNO-A1B2', hostId: 'u1', players: ['u1', 'u2'], save };
        RoomMock.findOne
            .mockResolvedValueOnce(fakeRoom)
            .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue({ code: 'UNO-A1B2', players: ['u2'] }) });
        PlayerMock.find.mockResolvedValue([]);

        await roomService.leaveRoom('UNO-A1B2', 'u1');

        expect(fakeRoom.hostId).toBe('u2');
        expect(save).toHaveBeenCalledTimes(1);
    });

    it('deve excluir a sala e devolver null quando o último jogador sair', async () => {
        const deleteOne = jest.fn();
        const save = jest.fn();
        RoomMock.findOne.mockResolvedValue({ code: 'UNO-A1B2', hostId: 'u1', players: ['u1'], deleteOne, save });

        const result = await roomService.leaveRoom('UNO-A1B2', 'u1');

        expect(deleteOne).toHaveBeenCalledTimes(1);
        expect(save).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('deve lançar erro 404 quando a sala não existir', async () => {
        RoomMock.findOne.mockResolvedValue(null);

        await expect(roomService.leaveRoom('UNO-XXXX', 'u1')).rejects.toMatchObject({
            errorCode: 'ROOM_NOT_FOUND',
            statusCode: 404,
        });
    });

    it('deve devolver a sala sem alterações quando o jogador não estiver nela', async () => {
        const save = jest.fn();
        RoomMock.findOne
            .mockResolvedValueOnce({ code: 'UNO-A1B2', hostId: 'u1', players: ['u1'], save })
            .mockReturnValueOnce({ lean: jest.fn().mockResolvedValue({ code: 'UNO-A1B2', players: ['u1'] }) });
        PlayerMock.find.mockResolvedValue([]);

        await roomService.leaveRoom('UNO-A1B2', 'u999');

        expect(save).not.toHaveBeenCalled();
    });
});
