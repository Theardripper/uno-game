import { jest } from '@jest/globals';

const PlayerMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

jest.unstable_mockModule('./player.model.js', () => ({ default: PlayerMock }));

const playerService = await import('./player.service.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('PlayerService - createPlayer', () => {
    it('deve criar o jogador repassando os dados recebidos para o model', async () => {
        const data = { name: 'John Doe', email: 'john@example.com' };
        const created = { _id: 'p1', ...data };
        PlayerMock.create.mockResolvedValue(created);

        const result = await playerService.createPlayer(data);

        expect(PlayerMock.create).toHaveBeenCalledWith(data);
        expect(result).toBe(created);
    });
});

describe('PlayerService - getPlayerById', () => {
    it('deve retornar o jogador encontrado pelo id', async () => {
        const player = { _id: 'p1', name: 'John Doe' };
        PlayerMock.findById.mockResolvedValue(player);

        const result = await playerService.getPlayerById('p1');

        expect(PlayerMock.findById).toHaveBeenCalledWith('p1');
        expect(result).toBe(player);
    });

    it('deve retornar null quando o jogador não for encontrado', async () => {
        PlayerMock.findById.mockResolvedValue(null);

        const result = await playerService.getPlayerById('nao-existe');

        expect(result).toBeNull();
    });
});

describe('PlayerService - updatePlayer', () => {
    it('deve atualizar o jogador e retornar o documento atualizado', async () => {
        const updated = { _id: 'p1', name: 'John Updated' };
        PlayerMock.findByIdAndUpdate.mockResolvedValue(updated);

        const result = await playerService.updatePlayer('p1', { name: 'John Updated' });

        expect(PlayerMock.findByIdAndUpdate).toHaveBeenCalledWith('p1', { name: 'John Updated' }, { new: true });
        expect(result).toBe(updated);
    });

    it('deve retornar null quando o jogador a ser atualizado não existir', async () => {
        PlayerMock.findByIdAndUpdate.mockResolvedValue(null);

        const result = await playerService.updatePlayer('nao-existe', { name: 'X' });

        expect(result).toBeNull();
    });
});

describe('PlayerService - deletePlayer', () => {
    it('deve remover o jogador e retornar o documento removido', async () => {
        const deleted = { _id: 'p1' };
        PlayerMock.findByIdAndDelete.mockResolvedValue(deleted);

        const result = await playerService.deletePlayer('p1');

        expect(PlayerMock.findByIdAndDelete).toHaveBeenCalledWith('p1');
        expect(result).toBe(deleted);
    });

    it('deve retornar null quando o jogador a ser removido não existir', async () => {
        PlayerMock.findByIdAndDelete.mockResolvedValue(null);

        const result = await playerService.deletePlayer('nao-existe');

        expect(result).toBeNull();
    });
});