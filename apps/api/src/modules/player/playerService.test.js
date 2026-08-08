import { jest, describe, it, expect, afterEach } from '@jest/globals';

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
  },
}));

jest.unstable_mockModule('./player.model.js', () => ({
  default: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const { validateAndProcessPlayerData, getPlayerById } = await import('./player.service.js');
const { default: Player } = await import('./player.model.js');

describe('Atividade #2 - Testes com Monad Maybe no PlayerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar e formatar dados do jogador com sucesso usando a Monad', () => {
    const rawData = { name: '  Moura  ', email: '  PLAYER@TESTE.COM  ' };
    const resultMaybe = validateAndProcessPlayerData(rawData);

    expect(resultMaybe.isNothing()).toBe(false);
    expect(resultMaybe.getOrElse(null)).toEqual({
      name: 'Moura',
      email: 'player@teste.com',
    });
  });

  it('deve retornar Nothing caso o e-mail seja inválido no pipeline', () => {
    const rawData = { name: 'Moura', email: 'email-invalido' };
    const resultMaybe = validateAndProcessPlayerData(rawData);
    expect(resultMaybe.isNothing()).toBe(true);
  });

  it('deve retornar Maybe com o jogador encontrado no Mongoose', async () => {
    const mockPlayer = { _id: '123', name: 'Moura', email: 'player@teste.com' };
    Player.findById.mockResolvedValue(mockPlayer);

    const resultMaybe = await getPlayerById('123');

    expect(resultMaybe.isNothing()).toBe(false);
    expect(resultMaybe.getOrElse(null)).toEqual(mockPlayer);
  });

  it('deve retornar Maybe contendo Nothing quando o jogador não for encontrado', async () => {
    Player.findById.mockResolvedValue(null);

    const resultMaybe = await getPlayerById('404');

    expect(resultMaybe.isNothing()).toBe(true);
    expect(resultMaybe.getOrElse('Não encontrado')).toBe('Não encontrado');
  });
});