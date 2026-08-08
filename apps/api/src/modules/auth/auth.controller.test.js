import { jest } from '@jest/globals';

jest.mock('#shared/helpers/response.js', () => ({
    success: jest.fn(),
}));

jest.mock('./auth.service.js', () => ({
    signUp: jest.fn(),
    signIn: jest.fn(),
    guest: jest.fn(),
}));

import { signUp, signIn, guestLogin } from './auth.controller.js';
import { success } from '#shared/helpers/response.js';
import * as authService from './auth.service.js';

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
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Conta criada com sucesso.', 201);
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
            expect(success).toHaveBeenCalledWith(res, mockServiceData, 'Logado com sucesso.');
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