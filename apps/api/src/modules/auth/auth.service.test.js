import { jest } from '@jest/globals';

const jwtMock = {
    generateToken: jest.fn(),
};

const PlayerMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    hashPassword: jest.fn(),
};

class AppErrorMock extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

jest.unstable_mockModule('#config/jwt.js', () => jwtMock);
jest.unstable_mockModule('#modules/player/player.model.js', () => ({ default: PlayerMock }));
jest.unstable_mockModule('#shared/errors/AppError.js', () => ({ AppError: AppErrorMock }));

const authService = await import('./auth.service.js');

beforeEach(() => {
    jest.clearAllMocks();
});

function fakePlayer(overrides = {}) {
    return {
        _id: { toString: () => 'player-id-1' },
        email: 'john@example.com',
        toPublicJSON: jest.fn().mockReturnValue({ id: 'player-id-1', name: 'John Doe' }),
        comparePassword: jest.fn(),
        save: jest.fn().mockResolvedValue(),
        ...overrides,
    };
}

// ===================== signUp =====================
describe('AuthService - signUp', () => {
    it('deve lançar AppError 409 quando o e-mail já estiver cadastrado', async () => {
        PlayerMock.findOne.mockResolvedValue(fakePlayer());

        await expect(authService.signUp('John Doe', 'john@example.com', 'senha123')).rejects.toMatchObject({
            message: 'Email already registered',
            statusCode: 409,
            errorCode: 'EMAIL_ALREADY_EXISTS',
        });
        expect(PlayerMock.create).not.toHaveBeenCalled();
    });

    it('deve criar o jogador com senha hasheada e retornar player público + token', async () => {
        PlayerMock.findOne.mockResolvedValue(null);
        PlayerMock.hashPassword.mockResolvedValue('hash-da-senha');
        const createdPlayer = fakePlayer();
        PlayerMock.create.mockResolvedValue(createdPlayer);
        jwtMock.generateToken.mockReturnValue('jwt-token-xyz');

        const result = await authService.signUp('John Doe', 'john@example.com', 'senha123');

        expect(PlayerMock.hashPassword).toHaveBeenCalledWith('senha123');
        expect(PlayerMock.create).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: 'hash-da-senha',
            is_guest: false,
        });
        expect(jwtMock.generateToken).toHaveBeenCalledWith({ id: 'player-id-1', email: 'john@example.com' });
        expect(result).toEqual({
            player: { id: 'player-id-1', name: 'John Doe' },
            token: 'jwt-token-xyz',
        });
    });
});

// ===================== signIn =====================
describe('AuthService - signIn', () => {
    it('deve lançar AppError 401 quando o jogador não existir', async () => {
        PlayerMock.findOne.mockResolvedValue(null);

        await expect(authService.signIn('naoexiste@example.com', 'senha123')).rejects.toMatchObject({
            message: 'Invalid email or password',
            statusCode: 401,
            errorCode: 'INVALID_CREDENTIALS',
        });
    });

    it('deve lançar AppError 401 quando a senha estiver incorreta', async () => {
        const player = fakePlayer();
        player.comparePassword.mockResolvedValue(false);
        PlayerMock.findOne.mockResolvedValue(player);

        await expect(authService.signIn('john@example.com', 'senhaErrada')).rejects.toMatchObject({
            message: 'Invalid email or password',
            statusCode: 401,
        });
        expect(player.save).not.toHaveBeenCalled();
    });

    it('deve autenticar com sucesso, atualizar last_active_at e retornar player + token', async () => {
        const player = fakePlayer();
        player.comparePassword.mockResolvedValue(true);
        PlayerMock.findOne.mockResolvedValue(player);
        jwtMock.generateToken.mockReturnValue('jwt-token-abc');

        const result = await authService.signIn('john@example.com', 'senha123');

        expect(player.last_active_at).toBeInstanceOf(Date);
        expect(player.save).toHaveBeenCalledTimes(1);
        expect(jwtMock.generateToken).toHaveBeenCalledWith({ id: 'player-id-1', email: 'john@example.com' });
        expect(result).toEqual({
            player: { id: 'player-id-1', name: 'John Doe' },
            token: 'jwt-token-abc',
        });
    });
});

// ===================== guest =====================
describe('AuthService - guest', () => {
    it('deve criar uma conta convidada com e-mail gerado automaticamente e is_guest true', async () => {
        const createdPlayer = fakePlayer();
        PlayerMock.create.mockResolvedValue(createdPlayer);
        jwtMock.generateToken.mockReturnValue('jwt-guest-token');

        const result = await authService.guest('Convidado', 'seed123');

        expect(PlayerMock.create).toHaveBeenCalledTimes(1);
        const createArgs = PlayerMock.create.mock.calls[0][0];
        expect(createArgs.name).toBe('Convidado');
        expect(createArgs.avatar_seed).toBe('seed123');
        expect(createArgs.is_guest).toBe(true);
        expect(createArgs.email).toMatch(/^guest_\d+_[a-z0-9]+@guest\.local$/);
        expect(result).toEqual({
            player: { id: 'player-id-1', name: 'John Doe' },
            token: 'jwt-guest-token',
        });
    });

    it('deve gerar o token apenas com o id do jogador, sem e-mail', async () => {
        PlayerMock.create.mockResolvedValue(fakePlayer());

        await authService.guest('Convidado', 'seed123');

        expect(jwtMock.generateToken).toHaveBeenCalledWith({ id: 'player-id-1' });
    });
});