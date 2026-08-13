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
  },
  // Isso diz ao Vitest para ignorar esses arquivos durante os testes.
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
  ],
});
