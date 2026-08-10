import { jest } from '@jest/globals';

const jwtMock = {
    verifyToken: jest.fn(),
};

class AppErrorMock extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

jest.unstable_mockModule('#config/jwt.js', () => jwtMock);
jest.unstable_mockModule('#shared/errors/AppError.js', () => ({ AppError: AppErrorMock }));

const { extractUser } = await import('./auth.middleware.js');

function mockReq(headers = {}) {
    return { headers };
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe('authMiddleware - extractUser', () => {
    it('deve lançar AppError 401 quando o header Authorization não for enviado', () => {
        const req = mockReq({});
        const next = jest.fn();

        expect(() => extractUser(req, {}, next)).toThrow('Token not provided');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve lançar AppError 401 quando o header não começar com "Bearer "', () => {
        const req = mockReq({ authorization: 'Token abc123' });
        const next = jest.fn();

        expect(() => extractUser(req, {}, next)).toThrow('Token not provided');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve lançar AppError 401 quando o token for inválido ou expirado', () => {
        const req = mockReq({ authorization: 'Bearer token-invalido' });
        jwtMock.verifyToken.mockReturnValue(null);
        const next = jest.fn();

        expect(() => extractUser(req, {}, next)).toThrow('Invalid or expired token');
        expect(jwtMock.verifyToken).toHaveBeenCalledWith('token-invalido');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve popular req.user e chamar next() quando o token for válido', () => {
        const decoded = { id: 'p1', username: 'jogador1' };
        const req = mockReq({ authorization: 'Bearer token-valido' });
        jwtMock.verifyToken.mockReturnValue(decoded);
        const next = jest.fn();

        extractUser(req, {}, next);

        expect(jwtMock.verifyToken).toHaveBeenCalledWith('token-valido');
        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalledTimes(1);
    });
});