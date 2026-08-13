import { jest } from '@jest/globals';

const cardServiceMock = {
    createCard: jest.fn(),
    getCardById: jest.fn(),
    updateCard: jest.fn(),
    deleteCard: jest.fn(),
};

const responseHelperMock = {
    success: jest.fn((res, data, message, statusCode = 200) => {
        return res.status(statusCode).json({ message, data });
    }),
};

jest.unstable_mockModule('./card.service.js', () => cardServiceMock);
jest.unstable_mockModule('#shared/helpers/response.js', () => responseHelperMock);

const cardController = await import('./card.controller.js');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

function mockReq(overrides = {}) {
    return {
        params: {},
        body: {},
        ...overrides,
    };
}

const mockNext = () => jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

// ===================== createCard (4 casos) =====================
describe('CardController - createCard', () => {
    it('deve criar a carta com os dados do body e responder via helper success (201)', async () => {
        const req = mockReq({ body: { color: 'red', value: '7', type: 'number' } });
        const res = mockRes();
        const next = mockNext();
        const fakeCard = { _id: 'c1', color: 'red', value: '7', type: 'number' };

        cardServiceMock.createCard.mockResolvedValue(fakeCard);

        await cardController.createCard(req, res, next);

        expect(cardServiceMock.createCard).toHaveBeenCalledWith(req.body);
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, fakeCard, 'Card created successfully', 201);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ body: { color: 'red', value: '7', type: 'number' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        cardServiceMock.createCard.mockRejectedValue(error);

        await cardController.createCard(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve repassar o body ao service mesmo quando ele vier vazio', async () => {
        const req = mockReq({ body: {} });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.createCard.mockResolvedValue({ _id: 'c1' });

        await cardController.createCard(req, res, next);

        expect(cardServiceMock.createCard).toHaveBeenCalledWith({});
        expect(next).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ body: { color: 'red' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        cardServiceMock.createCard.mockRejectedValue(error);

        await cardController.createCard(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});

// ===================== getCardById (6 casos) =====================
describe('CardController - getCardById', () => {
    it('deve retornar a carta encontrada pelo id via helper success', async () => {
        const req = mockReq({ params: { id: 'c1' } });
        const res = mockRes();
        const next = mockNext();
        const fakeCard = { _id: 'c1', color: 'blue', value: '3', type: 'number' };

        cardServiceMock.getCardById.mockResolvedValue(fakeCard);

        await cardController.getCardById(req, res, next);

        expect(cardServiceMock.getCardById).toHaveBeenCalledWith('c1');
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, fakeCard, 'Card fetched successfully');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve responder 404 com { error: Card not found } quando o service não encontrar a carta', async () => {
        const req = mockReq({ params: { id: 'naoexiste' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.getCardById.mockResolvedValue(null);

        await cardController.getCardById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
        expect(responseHelperMock.success).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ params: { id: 'c1' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        cardServiceMock.getCardById.mockRejectedValue(error);

        await cardController.getCardById(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve responder 404 quando o service devolver undefined', async () => {
        const req = mockReq({ params: { id: 'naoexiste' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.getCardById.mockResolvedValue(undefined);

        await cardController.getCardById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve consultar o service uma única vez quando a carta não existir', async () => {
        const req = mockReq({ params: { id: 'naoexiste' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.getCardById.mockResolvedValue(null);

        await cardController.getCardById(req, res, next);

        expect(cardServiceMock.getCardById).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar de forma síncrona', async () => {
        const req = mockReq({ params: { id: 'c1' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('Unexpected failure');

        cardServiceMock.getCardById.mockImplementation(() => {
            throw error;
        });

        await cardController.getCardById(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });
});

// ===================== updateCard (5 casos) =====================
describe('CardController - updateCard', () => {
    it('deve atualizar a carta e responder via helper success', async () => {
        const req = mockReq({ params: { id: 'c1' }, body: { color: 'green' } });
        const res = mockRes();
        const next = mockNext();
        const fakeCard = { _id: 'c1', color: 'green', value: '7', type: 'number' };

        cardServiceMock.updateCard.mockResolvedValue(fakeCard);

        await cardController.updateCard(req, res, next);

        expect(cardServiceMock.updateCard).toHaveBeenCalledWith('c1', req.body);
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, fakeCard, 'Card updated successfully');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve responder 404 com { error: Card not found } quando a carta não for encontrada', async () => {
        const req = mockReq({ params: { id: 'naoexiste' }, body: { color: 'green' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.updateCard.mockResolvedValue(null);

        await cardController.updateCard(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
        expect(responseHelperMock.success).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ params: { id: 'c1' }, body: { color: 'green' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        cardServiceMock.updateCard.mockRejectedValue(error);

        await cardController.updateCard(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve responder 404 quando o service devolver undefined', async () => {
        const req = mockReq({ params: { id: 'naoexiste' }, body: { color: 'green' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.updateCard.mockResolvedValue(undefined);

        await cardController.updateCard(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ params: { id: 'c1' }, body: { color: 'green' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        cardServiceMock.updateCard.mockRejectedValue(error);

        await cardController.updateCard(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});

// ===================== deleteCard (6 casos) =====================
describe('CardController - deleteCard', () => {
    it('deve remover a carta e responder via helper success com payload null', async () => {
        const req = mockReq({ params: { id: 'c1' } });
        const res = mockRes();
        const next = mockNext();
        const fakeCard = { _id: 'c1', color: 'red', value: '7', type: 'number' };

        cardServiceMock.deleteCard.mockResolvedValue(fakeCard);

        await cardController.deleteCard(req, res, next);

        expect(cardServiceMock.deleteCard).toHaveBeenCalledWith('c1');
        expect(responseHelperMock.success).toHaveBeenCalledWith(res, null, 'Card removed successfully');
        expect(next).not.toHaveBeenCalled();
    });

    it('deve responder 404 com { error: Card not found } quando a carta não for encontrada', async () => {
        const req = mockReq({ params: { id: 'naoexiste' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.deleteCard.mockResolvedValue(null);

        await cardController.deleteCard(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
        expect(responseHelperMock.success).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) quando o service lançar um erro', async () => {
        const req = mockReq({ params: { id: 'c1' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        cardServiceMock.deleteCard.mockRejectedValue(error);

        await cardController.deleteCard(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve responder 404 quando o service devolver undefined', async () => {
        const req = mockReq({ params: { id: 'naoexiste' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.deleteCard.mockResolvedValue(undefined);

        await cardController.deleteCard(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
        expect(responseHelperMock.success).not.toHaveBeenCalled();
    });

    it('deve responder 404 quando o service devolver um valor falsy como false', async () => {
        const req = mockReq({ params: { id: 'naoexiste' } });
        const res = mockRes();
        const next = mockNext();

        cardServiceMock.deleteCard.mockResolvedValue(false);

        await cardController.deleteCard(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(responseHelperMock.success).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('não deve responder nada pelo res quando o service falhar', async () => {
        const req = mockReq({ params: { id: 'c1' } });
        const res = mockRes();
        const next = mockNext();
        const error = new Error('DB failure');

        cardServiceMock.deleteCard.mockRejectedValue(error);

        await cardController.deleteCard(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
