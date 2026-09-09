import { jest } from '@jest/globals';

// Mocks dos módulos usados pelo controller (ESM nativo -> jest.unstable_mockModule
// em vez de jest.mock, que depende de require e não funciona neste projeto)
const responseHelperMock = {
    success: jest.fn(),
};

const authServiceMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    guest: jest.fn(),
};

jest.unstable_mockModule('#shared/helpers/response.js', () => responseHelperMock);
jest.unstable_mockModule('./auth.service.js', () => authServiceMock);

// Import dinâmico DEPOIS de registrar os mocks (obrigatório em ESM)
const { signUp, signIn, guestLogin } = await import('./auth.controller.js');
const { success } = await import('#shared/helpers/response.js');
const authService = await import('./auth.service.js');

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
        };
        res = {};
        next = jest.fn();
    });

    /* =========================================================================
       6.1. signUp
       ========================================================================= */
    describe('signUp', () => {
        it('deve cadastrar o usuário com sucesso e retornar status 201 via helper success', async () => {
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };
            const mockServiceData = { id: '1', name: 'John Doe', email: 'john@example.com' };
            authService.signUp.mockResolvedValue(mockServiceData);

            await signUp(req, res, next);

            expect(authService.signUp).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Account created successfully.', 201);
            expect(next).not.toHaveBeenCalled();
        });

        it('deve propagar qualquer erro para o middleware next(err) em caso de falha no authService.signUp', async () => {
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };
            const mockError = new Error('E-mail já cadastrado');
            authService.signUp.mockRejectedValue(mockError);

            await signUp(req, res, next);

            expect(authService.signUp).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       6.2. signIn
       ========================================================================= */
    describe('signIn', () => {
        it('deve autenticar o usuário com sucesso e retornar status 200 através do helper success', async () => {
            req.body = {
                email: 'john@example.com',
                password: 'password123',
            };
            const mockServiceData = { token: 'jwt-token-xyz', user: { id: '1', email: 'john@example.com' } };
            authService.signIn.mockResolvedValue(mockServiceData);

            await signIn(req, res, next);

            expect(authService.signIn).toHaveBeenCalledWith('john@example.com', 'password123');
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Logged successfully.');
            expect(next).not.toHaveBeenCalled();
        });

        it('deve propagar o erro para o middleware next(err) caso o authService.signIn falhe', async () => {
            req.body = {
                email: 'john@example.com',
                password: 'wrongpassword',
            };
            const mockError = new Error('Credenciais inválidas');
            authService.signIn.mockRejectedValue(mockError);

            await signIn(req, res, next);

            expect(authService.signIn).toHaveBeenCalledWith('john@example.com', 'wrongpassword');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });

    /* =========================================================================
       6.3. guestLogin
       ========================================================================= */
    describe('guestLogin', () => {
        it('deve criar a conta de convidado com sucesso e retornar status 201 via helper success', async () => {
            req.body = {
                name: 'Guest User',
                avatarSeed: 'seed123',
            };
            const mockServiceData = { id: 'guest_1', name: 'Guest User', token: 'guest-token' };
            authService.guest.mockResolvedValue(mockServiceData);

            await guestLogin(req, res, next);

            expect(authService.guest).toHaveBeenCalledWith('Guest User', 'seed123');
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Guest account created.', 201);
            expect(next).not.toHaveBeenCalled();
        });

        it('deve capturar e repassar qualquer exceção lançada pelo authService.guest para o middleware next(err)', async () => {
            req.body = {
                name: 'Guest User',
                avatarSeed: 'seed123',
            };
            const mockError = new Error('Erro ao gerar conta convidado');
            authService.guest.mockRejectedValue(mockError);

            await guestLogin(req, res, next);

            expect(authService.guest).toHaveBeenCalledWith('Guest User', 'seed123');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(success).not.toHaveBeenCalled();
        });
    });
});