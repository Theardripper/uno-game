import { jest } from '@jest/globals';

const CardMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

jest.unstable_mockModule('./card.model.js', () => ({ default: CardMock }));

const cardService = await import('./card.service.js');

beforeEach(() => {
    jest.clearAllMocks();
});

// ===================== createCard =====================
describe('CardService - createCard', () => {
    it('deve repassar os dados recebidos para o model e devolver a carta criada', async () => {
        const cardData = { color: 'red', value: '7', type: 'number' };
        const fakeCard = { _id: 'c1', ...cardData };
        CardMock.create.mockResolvedValue(fakeCard);

        const result = await cardService.createCard(cardData);

        expect(CardMock.create).toHaveBeenCalledWith(cardData);
        expect(CardMock.create).toHaveBeenCalledTimes(1);
        expect(result).toBe(fakeCard);
    });

    it('deve propagar o erro lançado pelo model', async () => {
        const error = new Error('Validation failed');
        CardMock.create.mockRejectedValue(error);

        await expect(cardService.createCard({})).rejects.toThrow('Validation failed');
    });
});

// ===================== getCardById =====================
describe('CardService - getCardById', () => {
    it('deve buscar a carta pelo id informado e devolver o resultado do model', async () => {
        const fakeCard = { _id: 'c1', color: 'blue', value: '3', type: 'number' };
        CardMock.findById.mockResolvedValue(fakeCard);

        const result = await cardService.getCardById('c1');

        expect(CardMock.findById).toHaveBeenCalledWith('c1');
        expect(result).toBe(fakeCard);
    });

    it('deve devolver null quando o model não encontrar a carta', async () => {
        CardMock.findById.mockResolvedValue(null);

        const result = await cardService.getCardById('naoexiste');

        expect(result).toBeNull();
    });

    it('deve propagar o erro lançado pelo model', async () => {
        CardMock.findById.mockRejectedValue(new Error('DB failure'));

        await expect(cardService.getCardById('c1')).rejects.toThrow('DB failure');
    });
});

// ===================== updateCard =====================
describe('CardService - updateCard', () => {
    it('deve atualizar a carta pelo id e pedir o documento já atualizado com a opção new', async () => {
        const updateData = { color: 'green' };
        const fakeCard = { _id: 'c1', color: 'green', value: '7', type: 'number' };
        CardMock.findByIdAndUpdate.mockResolvedValue(fakeCard);

        const result = await cardService.updateCard('c1', updateData);

        expect(CardMock.findByIdAndUpdate).toHaveBeenCalledWith('c1', updateData, { new: true });
        expect(result).toBe(fakeCard);
    });

    it('deve devolver null quando o model não encontrar a carta a ser atualizada', async () => {
        CardMock.findByIdAndUpdate.mockResolvedValue(null);

        const result = await cardService.updateCard('naoexiste', { color: 'green' });

        expect(result).toBeNull();
    });

    it('deve propagar o erro lançado pelo model', async () => {
        CardMock.findByIdAndUpdate.mockRejectedValue(new Error('DB failure'));

        await expect(cardService.updateCard('c1', {})).rejects.toThrow('DB failure');
    });
});

// ===================== deleteCard =====================
describe('CardService - deleteCard', () => {
    it('deve remover a carta pelo id informado e devolver o documento removido', async () => {
        const fakeCard = { _id: 'c1', color: 'red', value: '7', type: 'number' };
        CardMock.findByIdAndDelete.mockResolvedValue(fakeCard);

        const result = await cardService.deleteCard('c1');

        expect(CardMock.findByIdAndDelete).toHaveBeenCalledWith('c1');
        expect(result).toBe(fakeCard);
    });

    it('deve devolver null quando o model não encontrar a carta a ser removida', async () => {
        CardMock.findByIdAndDelete.mockResolvedValue(null);

        const result = await cardService.deleteCard('naoexiste');

        expect(result).toBeNull();
    });

    it('deve propagar o erro lançado pelo model', async () => {
        CardMock.findByIdAndDelete.mockRejectedValue(new Error('DB failure'));

        await expect(cardService.deleteCard('c1')).rejects.toThrow('DB failure');
    });
});
