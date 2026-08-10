import { jest } from '@jest/globals';

const { validate } = await import('./validate.middleware.js');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

function mockSchema(result) {
    return { safeParse: jest.fn().mockReturnValue(result) };
}

describe('validateMiddleware - validate', () => {
    it('deve substituir req.body pelos dados parseados e chamar next() quando a validação passar', () => {
        const parsedData = { email: 'john@example.com', password: '123456' };
        const schema = mockSchema({ success: true, data: parsedData });
        const req = { body: { email: 'john@example.com', password: '123456', extraField: 'ignorar' } };
        const originalBody = req.body;
        const res = mockRes();
        const next = jest.fn();

        validate(schema)(req, res, next);

        expect(schema.safeParse).toHaveBeenCalledWith(originalBody);
        expect(req.body).toEqual(parsedData);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 400 com os detalhes dos campos inválidos quando a validação falhar', () => {
        const issues = [
            { path: ['email'], message: 'Email inválido' },
            { path: ['password'], message: 'Senha muito curta' },
        ];
        const schema = mockSchema({ success: false, error: { issues } });
        const req = { body: { email: 'invalido', password: '1' } };
        const res = mockRes();
        const next = jest.fn();

        validate(schema)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: 'INVALID_PAYLOAD',
                message: 'Validation failed',
                details: [
                    { field: 'email', message: 'Email inválido' },
                    { field: 'password', message: 'Senha muito curta' },
                ],
            },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve unir caminhos aninhados com ponto no nome do campo (ex.: endereco.cidade)', () => {
        const issues = [{ path: ['endereco', 'cidade'], message: 'Cidade obrigatória' }];
        const schema = mockSchema({ success: false, error: { issues } });
        const req = { body: {} };
        const res = mockRes();

        validate(schema)(req, res, jest.fn());

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    details: [{ field: 'endereco.cidade', message: 'Cidade obrigatória' }],
                }),
            })
        );
    });
});