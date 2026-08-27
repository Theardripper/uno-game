const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Caminho para o app Next.js carregar next.config.js e arquivos .env
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Resolve o alias de importação do seu projeto (@/helpers/cn.js, etc.)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(config);