import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./jest.setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  // Isso diz ao Vitest para ignorar esses arquivos durante os testes.
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
  ],
});
