import { jest } from '@jest/globals';

class AppErrorMock extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

const loggerMock = {
    error: jest.fn(),
};

jest.unstable_mockModule('#shared/errors/AppError.js', () => ({ AppError: AppErrorMock }));
jest.unstable_mockModule('#shared/logger/logger.js', () => ({ logger: loggerMock, default: loggerMock }));

const { errorHandler } = await import('./errorHandler.middleware.js');
const { AppError } = await import('#shared/errors/AppError.js');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe('errorHandler', () => {
    it('deve retornar o statusCode e a mensagem do AppError quando o erro for uma instância dele', () => {
        const err = new AppError('Game not found', 404, 'GAME_NOT_FOUND');
        const res = mockRes();
        const next = jest.fn();

        errorHandler(err, {}, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: { code: 'GAME_NOT_FOUND', message: 'Game not found' },
        });
    });

    it('deve retornar 409 com o nome do campo duplicado em erro de chave única do Mongo', () => {
        const err = {
            name: 'MongoServerError',
            code: 11000,
            keyPattern: { email: 1 },
        };
        const res = mockRes();

        errorHandler(err, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: 'DUPLICATE_ENTRY',
                message: "The value for 'email' already exists",
            },
        });
    });

    it('deve usar "field" como nome genérico quando o erro de duplicidade não tiver keyPattern', () => {
        const err = { name: 'MongoServerError', code: 11000 };
        const res = mockRes();

        errorHandler(err, {}, res, jest.fn());

        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: 'DUPLICATE_ENTRY',
                message: "The value for 'field' already exists",
            },
        });
    });

    it('deve retornar 500 genérico e logar o erro quando for um erro inesperado', () => {
        const err = new Error('Falha totalmente inesperada');
        const res = mockRes();

        errorHandler(err, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred',
            },
        });
        expect(loggerMock.error).toHaveBeenCalledWith('Unhandled error', { error: err });
    });
});