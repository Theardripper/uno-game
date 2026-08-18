/**
 * Middleware de memoização configurável utilizando estratégia LRU in-memory
 *
 * @param {Object} config Configurações do cache
 * @param {number} config.max Quantidade máxima de entradas permitidas no cache
 * @param {number} config.maxAge Tempo de vida de cada entrada em milissegundos
 * @returns {import('express').RequestHandler}
 */
export const memoizationMiddleware = (config = { max: 50, maxAge: 30000 }) => {
    // Validação da configuração
    const max = typeof config.max === "number" && config.max > 0 ? config.max : 50;
    const maxAge = typeof config.maxAge === "number" && config.maxAge > 0 ? config.maxAge : 30000;

    // Utiliza a estrutura de Map que preserva a ordem de inserção no Js
    const cacheMap = new Map();

    return (req, res, next) => {
        // Ignora métodos mutáveis, fazendo cache apenas de GET
        if (req.method !== "GET") {
            return next();
        }

        // Chave do cache: HTTP METHOD + URL determinística
        const key = `${req.method}:${req.originalUrl}`;
        const now = Date.now();

        // Verifica se a chave existe no cache
        if (cacheMap.has(key)) {
            const entry = cacheMap.get(key);

            // Verifica expiração
            if (now > entry.expiresAt) {
                // Entrada expirada
                cacheMap.delete(key);
            } else {
                // Entrada válida
                // Renova acesso e expiração
                entry.lastAccessedAt = now;
                entry.expiresAt = now + maxAge;

                // Para manter a política LRU usando Map, removemos a entrada atual
                // e inserimos novamente para que ela vá para o final do iterável (Mais recentemente usada)
                cacheMap.delete(key);
                cacheMap.set(key, entry);

                // Retorna resposta armazenada sem chamar next()
                return res.json(entry.value);
            }
        }

        // Interceptação da resposta para preencher o cache
        const originalJson = res.json;

        res.json = function (body) {
            // Apenas armazenar se for uma resposta com status de sucesso (2__)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const nowSet = Date.now();

                // Se o cache estiver cheio, aplicar política LRU
                if (cacheMap.size >= max && !cacheMap.has(key)) {
                    // map.keys().next().value sempre retorna a chave mais antiga (Least Recently Used)
                    const lruKey = cacheMap.keys().next().value;
                    cacheMap.delete(lruKey);
                }

                // Armazena nova entrada no cache
                cacheMap.set(key, {
                    key: key,
                    value: body,
                    createdAt: nowSet,
                    lastAccessedAt: nowSet,
                    expiresAt: nowSet + maxAge,
                });
            }

            // Executa o comportamento original
            return originalJson.call(this, body);
        };

        // Continua execução do pipeline do express
        next();
    };
};
