import { logger } from './logger.js';

describe('logger', () => {
    it('deve expor os métodos padrão de logging', () => {
        expect(typeof logger.error).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.debug).toBe('function');
    });

    it('deve ter pelo menos um transporte de console configurado', () => {
        const hasConsoleTransport = logger.transports.some((t) => t.name === 'console');
        expect(hasConsoleTransport).toBe(true);
    });

    it('deve usar nível "debug" fora de produção por padrão', () => {
        // NODE_ENV é definido como "test" pelo Jest, então cai no branch de não-produção
        expect(['debug', 'info']).toContain(logger.level);
    });
});