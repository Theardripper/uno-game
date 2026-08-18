import { jest } from "@jest/globals";
import { memoizationMiddleware } from "./memoization.middleware.js";

describe("Memoization Middleware", () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let mockJson;

    beforeEach(() => {
        mockReq = {
            method: "GET",
            originalUrl: "/api/test",
        };
        mockJson = jest.fn();
        mockRes = {
            statusCode: 200,
            json: mockJson,
        };
        mockNext = jest.fn();

        // Use fake timers to test maxAge and LRU access times
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it("should ignore non-GET methods", () => {
        const middleware = memoizationMiddleware();
        mockReq.method = "POST";

        middleware(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        // original json should not be intercepted
        expect(mockRes.json).toBe(mockJson);
    });

    it("should store response on first request (Cache Miss)", () => {
        const middleware = memoizationMiddleware();

        middleware(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();

        // Simulate endpoint calling res.json
        mockRes.json({ data: "test" });

        expect(mockJson).toHaveBeenCalledWith({ data: "test" });
    });

    it("should return cached response on subsequent requests (Cache Hit)", () => {
        const middleware = memoizationMiddleware();

        // Primeira request - Miss
        middleware(mockReq, mockRes, mockNext);
        mockRes.json({ data: "test" });

        // Reseta os mocks
        mockNext.mockClear();
        mockJson.mockClear();

        // Segunda request - Hit
        // Restaurar mockRes original para evitar json aninhado infinitamente nas calls de teste (ou apenas chamar o middleware)
        const mockRes2 = { statusCode: 200, json: jest.fn() };
        middleware(mockReq, mockRes2, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes2.json).toHaveBeenCalledWith({ data: "test" });
    });

    it("should differentiate between different keys (e.g., query params)", () => {
        const middleware = memoizationMiddleware();

        // /api/test?page=1
        mockReq.originalUrl = "/api/test?page=1";
        middleware(mockReq, mockRes, mockNext);
        mockRes.json({ page: 1 });

        // /api/test?page=2
        const mockReq2 = { method: "GET", originalUrl: "/api/test?page=2" };
        const mockRes2 = { statusCode: 200, json: jest.fn() };
        const mockNext2 = jest.fn();

        middleware(mockReq2, mockRes2, mockNext2);

        // Como a url é diferente, next deve ser chamado (cache miss)
        expect(mockNext2).toHaveBeenCalled();
        mockRes2.json({ page: 2 });
    });

    it("should expire items after maxAge", () => {
        const middleware = memoizationMiddleware({ max: 10, maxAge: 1000 }); // 1 segundo

        // 1a request
        middleware(mockReq, mockRes, mockNext);
        mockRes.json({ test: 1 });

        // Avança 1001 ms (expira)
        jest.advanceTimersByTime(1001);

        mockNext.mockClear();

        // 2a request (Cache Miss - Experido)
        const mockRes2 = { statusCode: 200, json: jest.fn() };
        middleware(mockReq, mockRes2, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it("should renew expiration upon access", () => {
        const middleware = memoizationMiddleware({ max: 10, maxAge: 1000 }); // 1 segundo

        // 1a request
        middleware(mockReq, mockRes, mockNext);
        mockRes.json({ test: 1 });

        // Avança 800 ms (ainda válido)
        jest.advanceTimersByTime(800);

        // 2a request (Cache Hit - Renova expiração)
        const mockRes2 = { statusCode: 200, json: jest.fn() };
        middleware(mockReq, mockRes2, jest.fn());

        // Avança mais 800 ms
        // Total de 1600ms desde a criação. Se não tivesse renovado, teria expirado aos 1000ms.
        // Como renovou aos 800ms, é válido até 1800ms.
        jest.advanceTimersByTime(800);

        const mockRes3 = { statusCode: 200, json: jest.fn() };
        const mockNext3 = jest.fn();

        middleware(mockReq, mockRes3, mockNext3);

        // Como foi renovado, next não deve ser chamado, é um Cache Hit
        expect(mockNext3).not.toHaveBeenCalled();
        expect(mockRes3.json).toHaveBeenCalledWith({ test: 1 });
    });

    it("should respect the max limit and evict LRU items", () => {
        const middleware = memoizationMiddleware({ max: 2, maxAge: 5000 });

        // Req A
        const reqA = { method: "GET", originalUrl: "/A" };
        const resA = { statusCode: 200, json: jest.fn() };
        middleware(reqA, resA, jest.fn());
        resA.json({ val: "A" });

        jest.advanceTimersByTime(10); // avança tempo para dar diferenca de lastAccess

        // Req B
        const reqB = { method: "GET", originalUrl: "/B" };
        const resB = { statusCode: 200, json: jest.fn() };
        middleware(reqB, resB, jest.fn());
        resB.json({ val: "B" });

        jest.advanceTimersByTime(10);

        // Acesso ao A (Isso o torna o Most Recently Used)
        const resA2 = { statusCode: 200, json: jest.fn() };
        middleware(reqA, resA2, jest.fn());

        jest.advanceTimersByTime(10);

        // Req C (Excede max, deve evictar B que agora é o LRU)
        const reqC = { method: "GET", originalUrl: "/C" };
        const resC = { statusCode: 200, json: jest.fn() };
        const nextC = jest.fn();
        middleware(reqC, resC, nextC);
        resC.json({ val: "C" });

        // Agora verificamos se B foi deletado e A/C permanecem
        const resB2 = { statusCode: 200, json: jest.fn() };
        const nextB2 = jest.fn();
        middleware(reqB, resB2, nextB2);

        // next chamado => B foi evictado do cache
        expect(nextB2).toHaveBeenCalled();

        const resA3 = { statusCode: 200, json: jest.fn() };
        const nextA3 = jest.fn();
        middleware(reqA, resA3, nextA3);

        // next NÃO chamado => A permanece no cache
        expect(nextA3).not.toHaveBeenCalled();
    });

    it("should not cache error responses (non 2xx)", () => {
        const middleware = memoizationMiddleware();

        middleware(mockReq, mockRes, mockNext);

        mockRes.statusCode = 404;
        mockRes.json({ error: "Not Found" });

        // Segunda request deve dar miss
        const mockRes2 = { statusCode: 200, json: jest.fn() };
        const mockNext2 = jest.fn();
        middleware(mockReq, mockRes2, mockNext2);

        expect(mockNext2).toHaveBeenCalled();
    });
});
