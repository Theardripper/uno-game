// Este arquivo roda ANTES de qualquer teste/import, garantindo que
// src/config/env.js (validação com zod) não derrube o processo com
// process.exit(1) por falta de variáveis obrigatórias durante os testes.
process.env.PORT = process.env.PORT || '3001';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uno-game-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jest';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';