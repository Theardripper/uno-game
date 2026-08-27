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