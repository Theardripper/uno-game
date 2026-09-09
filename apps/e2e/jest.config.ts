import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.spec.ts"],
    verbose: true,
    testTimeout: 10000,
};

export default config;
