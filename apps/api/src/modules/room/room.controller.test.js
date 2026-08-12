import { jest } from '@jest/globals';

const roomServiceMock = {
    createRoom: jest.fn(),
    validateRoomCode: jest.fn(),
    getRoomByCode: jest.fn(),
    joinRoom: jest.fn(),
    updateRoom: jest.fn(),
    deleteRoom: jest.fn(),
};

const responseHelperMock = {
    success: jest.fn((res, data, message, statusCode = 200) => {
        return res.status(statusCode).json({ message, data });
    }),
};

jest.unstable_mockModule('./room.service.js', () => roomServiceMock);
jest.unstable_mockModule('#shared/helpers/response.js', () => responseHelperMock);

const roomController = await import('./room.controller.js');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}

function mockReq(overrides = {}) {
    return {
        params: {},
        body: {},
        user: { id: 'user123' },
        ...overrides,
    };
}

const mockNext = () => jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

// ===================== createRoom (6 casos) =====================
describe('RoomController - createRoom', () => {
    it('deve criar a sala com o id do usuário e os dados do body e responder via helper success (201)', async () => {
        const req = mockReq({ body: { name: 'Sala do João', maxPlayers: 4, isPrivate: false } });
        const res = mockRes();
        const next = mockNext();
        const fakeRoom = { _id: 'r1', code: 'UNO-A1B2', name: 'Sala do João' };

        roomServiceMock.createRoom.mockResolvedValue(fakeRoom);

        await roomController.createRoom(req, res, next);

        expect(roomServiceMock.createRoom).toHaveBeenCalledWith('user123', req.body);
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, { room: fakeRoom }, 'Sala criada com sucesso', 201);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve passar o id do usuário autenticado como primeiro argumento do service', async () => {
        const req = mockReq({ body: { name: 'Sala do João' }, user: { id: 'user999' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.createRoom.mockResolvedValue({ _id: 'r1' });

        await roomController.createRoom(req, res, next);

        expect(roomServiceMock.createRoom).toHaveBeenCalledWith('user999', req.body);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ body: { name: 'Sala do João' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        roomServiceMock.createRoom.mockRejectedValue(error);

        await roomController.createRoom(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando a requisição chegar sem usuário autenticado', async () => {
        const req = { params: {}, body: { name: 'Sala do João' } };
        const res = mockRes();
        const next = mockNext();

        await roomController.createRoom(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(roomServiceMock.createRoom).not.toHaveBeenCalled();
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ body: { name: 'Sala do João' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        roomServiceMock.createRoom.mockRejectedValue(error);

        await roomController.createRoom(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('deve chamar next(error) quando o service lançar de forma síncrona', async () => {
        const req = mockReq({ body: { name: 'Sala do João' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Unexpected failure');

        roomServiceMock.createRoom.mockImplementation(() => {
            throw error;
        });

        await roomController.createRoom(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });
});

// ===================== validateRoomCode (5 casos) =====================
describe('RoomController - validateRoomCode', () => {
    it('deve validar o código e responder com { room, canJoin: true } via helper success (200)', async () => {
        const req = mockReq({ params: { code: 'UNO-A1B2' } });
        const res = mockRes();
        const next = mockNext();
        const fakeRoom = { _id: 'r1', code: 'UNO-A1B2', maxPlayers: 4 };

        roomServiceMock.validateRoomCode.mockResolvedValue(fakeRoom);

        await roomController.validateRoomCode(req, res, next);

        expect(roomServiceMock.validateRoomCode).toHaveBeenCalledWith('UNO-A1B2');
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, { room: fakeRoom, canJoin: true }, 'Sala válida para entrar', 200);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve buscar a sala usando o código recebido no parâmetro da URL', async () => {
        const req = mockReq({ params: { code: 'UNO-Z9Y8' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.validateRoomCode.mockResolvedValue({ _id: 'r2', code: 'UNO-Z9Y8' });

        await roomController.validateRoomCode(req, res, next);

        expect(roomServiceMock.validateRoomCode).toHaveBeenCalledWith('UNO-Z9Y8');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o código for inválido ou a sala não existir', async () => {
        const req = mockReq({ params: { code: 'UNO-XXXX' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Room not found');

        roomServiceMock.validateRoomCode.mockRejectedValue(error);

        await roomController.validateRoomCode(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve repassar o erro de sala cheia lançado pelo service sem alterar o conteúdo', async () => {
        const req = mockReq({ params: { code: 'UNO-A1B2' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Sala cheia');
        error.statusCode = 409;

        roomServiceMock.validateRoomCode.mockRejectedValue(error);

        await roomController.validateRoomCode(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(next.mock.calls[0][0].statusCode).toBe(409);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ params: { code: 'UNO-XXXX' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.validateRoomCode.mockRejectedValue(new Error('Sala não encontrada'));

        await roomController.validateRoomCode(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

// ===================== getRoomByCode (4 casos) =====================
describe('RoomController - getRoomByCode', () => {
    it('deve retornar a sala encontrada via helper success (200)', async () => {
        const req = mockReq({ params: { code: 'UNO-A1B2' } });
        const res = mockRes();
        const next = mockNext();
        const fakeRoom = { _id: 'r1', code: 'UNO-A1B2', players: [] };

        roomServiceMock.getRoomByCode.mockResolvedValue(fakeRoom);

        await roomController.getRoomByCode(req, res, next);

        expect(roomServiceMock.getRoomByCode).toHaveBeenCalledWith('UNO-A1B2');
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, { room: fakeRoom }, 'Sala recuperada com sucesso', 200);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ params: { code: 'UNO-XXXX' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Room not found');

        roomServiceMock.getRoomByCode.mockRejectedValue(error);

        await roomController.getRoomByCode(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve repassar o erro de sala inexistente lançado pelo service sem alterar o conteúdo', async () => {
        const req = mockReq({ params: { code: 'UNO-XXXX' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Sala não encontrada');
        error.statusCode = 404;

        roomServiceMock.getRoomByCode.mockRejectedValue(error);

        await roomController.getRoomByCode(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(next.mock.calls[0][0].statusCode).toBe(404);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ params: { code: 'UNO-XXXX' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.getRoomByCode.mockRejectedValue(new Error('Sala não encontrada'));

        await roomController.getRoomByCode(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});

// ===================== joinRoom (5 casos) =====================
describe('RoomController - joinRoom', () => {
    it('deve associar o jogador à sala e responder via helper success (200)', async () => {
        const req = mockReq({ body: { roomCode: 'UNO-A1B2' } });
        const res = mockRes();
        const next = mockNext();
        const fakeRoom = { _id: 'r1', code: 'UNO-A1B2', players: ['user123'] };

        roomServiceMock.joinRoom.mockResolvedValue(fakeRoom);

        await roomController.joinRoom(req, res, next);

        expect(roomServiceMock.joinRoom).toHaveBeenCalledWith('UNO-A1B2', 'user123');
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, { room: fakeRoom }, 'Entrou na sala com sucesso', 200);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve passar o código do body e o id do usuário autenticado para o service', async () => {
        const req = mockReq({ body: { roomCode: 'UNO-Z9Y8' }, user: { id: 'user999' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.joinRoom.mockResolvedValue({ _id: 'r2' });

        await roomController.joinRoom(req, res, next);

        expect(roomServiceMock.joinRoom).toHaveBeenCalledWith('UNO-Z9Y8', 'user999');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando a sala estiver cheia ou o jogo já tiver começado', async () => {
        const req = mockReq({ body: { roomCode: 'UNO-A1B2' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Room is full');

        roomServiceMock.joinRoom.mockRejectedValue(error);

        await roomController.joinRoom(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando a requisição chegar sem usuário autenticado', async () => {
        const req = { params: {}, body: { roomCode: 'UNO-A1B2' } };
        const res = mockRes();
        const next = mockNext();

        await roomController.joinRoom(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(roomServiceMock.joinRoom).not.toHaveBeenCalled();
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ body: { roomCode: 'UNO-A1B2' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.joinRoom.mockRejectedValue(new Error('Room is full'));

        await roomController.joinRoom(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

// ===================== updateRoom (5 casos) =====================
describe('RoomController - updateRoom', () => {
    it('deve atualizar a sala e responder via helper success (200)', async () => {
        const req = mockReq({ params: { id: 'r1' }, body: { maxPlayers: 6 } });
        const res = mockRes();
        const next = mockNext();
        const fakeRoom = { _id: 'r1', code: 'UNO-A1B2', maxPlayers: 6 };

        roomServiceMock.updateRoom.mockResolvedValue(fakeRoom);

        await roomController.updateRoom(req, res, next);

        expect(roomServiceMock.updateRoom).toHaveBeenCalledWith('r1', 'user123', req.body);
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, { room: fakeRoom }, 'Sala atualizada com sucesso', 200);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve passar o id da sala, o id do usuário autenticado e os novos dados para o service', async () => {
        const req = mockReq({ params: { id: 'r7' }, body: { isPrivate: true }, user: { id: 'user999' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.updateRoom.mockResolvedValue({ _id: 'r7' });

        await roomController.updateRoom(req, res, next);

        expect(roomServiceMock.updateRoom).toHaveBeenCalledWith('r7', 'user999', req.body);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o usuário não tiver permissão ou os dados forem inválidos', async () => {
        const req = mockReq({ params: { id: 'r1' }, body: { maxPlayers: 6 } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Not allowed');

        roomServiceMock.updateRoom.mockRejectedValue(error);

        await roomController.updateRoom(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando a requisição chegar sem usuário autenticado', async () => {
        const req = { params: { id: 'r1' }, body: { maxPlayers: 6 } };
        const res = mockRes();
        const next = mockNext();

        await roomController.updateRoom(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(roomServiceMock.updateRoom).not.toHaveBeenCalled();
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ params: { id: 'r1' }, body: { maxPlayers: 6 } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.updateRoom.mockRejectedValue(new Error('Not allowed'));

        await roomController.updateRoom(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

// ===================== deleteRoom (4 casos) =====================
describe('RoomController - deleteRoom', () => {
    it('deve deletar a sala e responder com status 204 e corpo vazio', async () => {
        const req = mockReq({ params: { id: 'r1' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.deleteRoom.mockResolvedValue(undefined);

        await roomController.deleteRoom(req, res, next);

        expect(roomServiceMock.deleteRoom).toHaveBeenCalledWith('r1', 'user123');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
        expect(responseHelperMock.success).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando a sala não existir ou o usuário não tiver permissão', async () => {
        const req = mockReq({ params: { id: 'r1' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Not allowed');

        roomServiceMock.deleteRoom.mockRejectedValue(error);

        await roomController.deleteRoom(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando a requisição chegar sem usuário autenticado', async () => {
        const req = { params: { id: 'r1' }, body: {} };
        const res = mockRes();
        const next = mockNext();

        await roomController.deleteRoom(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(roomServiceMock.deleteRoom).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('não deve enviar corpo algum quando o service falhar', async () => {
        const req = mockReq({ params: { id: 'r1' } });
        const res = mockRes();
        const next = mockNext();

        roomServiceMock.deleteRoom.mockRejectedValue(new Error('Not allowed'));

        await roomController.deleteRoom(req, res, next);

        expect(res.send).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
