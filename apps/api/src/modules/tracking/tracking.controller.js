import TrackingLog from "#modules/tracking/tracking.model.js";

/**
 * GET /stats/requests
 * Retorna o número total de solicitações e a divisão por endpoint e método HTTP.
 */
export const getRequestStats = async (req, res) => {
    try {
        const logs = await TrackingLog.find();

        // Agrupa requisições por endpointAccess e depois por requestMethod
        const breakdown = logs.reduce((acc, log) => {
            const endpoint = log.endpointAccess;
            const method = log.requestMethod;

            if (!acc[endpoint]) {
                acc[endpoint] = {};
            }

            acc[endpoint][method] = (acc[endpoint][method] || 0) + 1;

            return acc;
        }, {});

        return res.status(200).json({
            total_requests: logs.length,
            breakdown
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas de requisições:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};

/**
 * GET /stats/response-times
 * Retorna os tempos de resposta médio (avg), mínimo (min) e máximo (max) por endpoint.
 */
export const getResponseTimeStats = async (req, res) => {
    try {
        const logs = await TrackingLog.find();

        // 1. Agrupa os tempos de resposta por endpointAccess
        const groupedByEndpoint = logs.reduce((acc, log) => {
            const endpoint = log.endpointAccess;

            if (!acc[endpoint]) {
                acc[endpoint] = [];
            }

            acc[endpoint].push(log.responseTime);
            return acc;
        }, {});

        // 2. Transforma cada grupo calculando avg, min e max
        const responseTimesStats = Object.keys(groupedByEndpoint).reduce((acc, endpoint) => {
            const times = groupedByEndpoint[endpoint];

            const min = Math.min(...times);
            const max = Math.max(...times);
            const totalSum = times.reduce((sum, time) => sum + time, 0);
            const avg = Math.round(totalSum / times.length);

            acc[endpoint] = { avg, min, max };
            return acc;
        }, {});

        return res.status(200).json(responseTimesStats);
    } catch (error) {
        console.error("Erro ao calcular tempos de resposta:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};

/**
 * GET /stats/status-codes
 * Retorna os códigos de status HTTP e a contagem de vezes que ocorreram.
 */
export const getStatusCodeStats = async (req, res, next) => {
    try {
        const logs = await TrackingLog.find();

        const statusCodeCounts = logs.reduce((acc, log) => {
            const code = log.statusCode;
            acc[code] = (acc[code] || 0) + 1;
            return acc;
        }, {});

        return res.status(200).json(statusCodeCounts);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /stats/popular-endpoints
 * Identifica qual foi o endpoint mais acessado e retorna sua quantidade.
 */
export const getPopularEndpointsStats = async (req, res, next) => {
    try {
        const logs = await TrackingLog.find();

        if (logs.length === 0) {
            return res.status(200).json({
                most_popular: null,
                request_count: 0
            });
        }

        const counts = logs.reduce((acc, log) => {
            const endpoint = log.endpointAccess;
            acc[endpoint] = (acc[endpoint] || 0) + 1;
            return acc;
        }, {});

        // Desempate: Se houver empate, pegamos o primeiro por ordem alfabética da string da rota
        const mostPopular = Object.entries(counts).reduce((max, current) => {
            if (current[1] > max[1]) {
                return current;
            } else if (current[1] === max[1]) {
                return current[0] < max[0] ? current : max;
            }
            return max;
        });

        return res.status(200).json({
            most_popular: mostPopular[0],
            request_count: mostPopular[1]
        });
    } catch (error) {
        next(error);
    }
};