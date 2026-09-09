# Configuração do Jest no Next.js

Este guia mostra os passos necessários para configurar e executar o Jest no projeto.

> **Contexto:** o arquivo `jest.config.js` já foi criado e as dependências necessárias já estão instaladas.

## 1. Verificar a estrutura do projeto

O projeto possui o Next.js dentro de `apps/frontend`:

```text
uno-game/
└── apps/
    └── frontend/
        ├── src/
        ├── tests/
        ├── jest.config.js
        ├── jsconfig.json
        ├── next.config.mjs
        ├── package.json
        └── ...

Todos os comandos relacionados ao Jest devem ser executados dentro de:

apps/frontend/
2. Conferir o jest.config.js

O arquivo já existente deve possuir uma configuração semelhante a:

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(config);
O que cada configuração faz

dir: "./" indica que o projeto Next.js está na pasta atual.

coverageProvider: "v8" define o mecanismo utilizado para calcular a cobertura dos testes.

testEnvironment: "jsdom" permite executar testes em um ambiente semelhante ao navegador.

moduleNameMapper configura o alias @/ para apontar para src/.

Por exemplo:

import Button from "@/widgets/Button";

será resolvido para:

apps/frontend/src/widgets/Button
3. Configurar o jsconfig.json

Abra:

apps/frontend/jsconfig.json

Verifique se existe:

{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

Se o arquivo já possuir outras configurações, não apague nenhuma. Apenas adicione paths dentro de compilerOptions.

4. Verificar o package.json

Abra:

apps/frontend/package.json

Na seção "scripts", adicione:

"test": "jest"

Por exemplo:

{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest"
  }
}

Se "test" já existir, não crie outro.

5. Criar um teste simples

Crie:

apps/frontend/tests/example.test.js

Com:

describe("Teste inicial", () => {
  it("deve funcionar", () => {
    expect(1 + 1).toBe(2);
  });
});
6. Executar os testes

No terminal:

cd apps/frontend
npm test

Se estiver tudo correto, o teste deverá aparecer como PASS.

7. Executar com cobertura

Para gerar o relatório de cobertura:

npm test -- --coverage
Checklist
 jest.config.js está em apps/frontend/
 dir: "./" está configurado
 testEnvironment: "jsdom" está configurado
 coverageProvider: "v8" está configurado
 moduleNameMapper aponta @/ para src/
 jsconfig.json possui @/* → ./src/*
 package.json possui "test": "jest"
 Existe pelo menos um arquivo .test.js ou .test.jsx
 O comando é executado dentro de apps/frontend
Estrutura final
uno-game/
└── apps/
    └── frontend/
        ├── src/
        │   ├── styles/
        │   ├── view/
        │   ├── widgets/
        │   └── ...
        │
        ├── tests/
        │   └── example.test.js
        │
        ├── jest.config.js
        ├── jsconfig.json
        ├── next.config.mjs
        ├── package.json
        └── ...

Depois disso:

cd apps/frontend
npm test