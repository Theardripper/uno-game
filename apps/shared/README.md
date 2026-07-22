# Shared (Domain & Contracts Layer)

Esta pasta (`apps/shared`) contém toda a lógica, tipos e contratos que são compartilhados entre o **Frontend** (Next.js) e o **Backend** (Node.js) do jogo UNO.

O objetivo principal desta camada é garantir consistência de dados, evitar duplicação de interfaces e centralizar as regras de negócio puras que podem ser reaproveitadas por ambos os lados da aplicação.

## 🗂️ Estrutura

- `api/`: Contratos de requisição (`requests/`) e resposta (`responses/`) para a API REST. Também expõe os endpoints centralizados (`routes.js`).
- `docs/`: Documentações de arquitetura, como o Modelo de Entidade e Relacionamento (MER) do banco de dados.
- `game/`: Lógicas puras de regras de negócio (`rules.js`), constantes e estados do jogo que não dependem de bibliotecas externas (agnósticos).
- `schemas/`: Schemas de validação de dados em tempo de execução utilizando **Zod**, úteis para payloads HTTP ou de WebSocket.
- `socket/`: Contratos para o Socket.IO, incluindo nomes de eventos (`events.js`) e a tipagem de payloads esperados (`payloads.js`).
- `types/`: Tipagens baseadas em JSDoc para todas as entidades fundamentais do banco de dados (Player, Room, Game, Card, etc).
- `index.d.ts`: Arquivo de exportação global que consolida todos os tipos da pasta.

## 🛠️ Como usar no Frontend (Next.js)

O frontend pode importar diretamente as validações, constantes e tipos. Exemplo:

```javascript
import { ApiRoutes } from "shared/api";
import { SignInSchema } from "shared/schemas";
import { ErrorCodes } from "shared/api";

/** @type {import('shared').SignInRequest} */
const data = { email: "...", password: "..." };

const response = await ky.post(ApiRoutes.AUTH.SIGN_IN, { json: data });
```

## ⚙️ Como usar no Backend (Node.js)

O backend utiliza o `shared` para garantir que o retorno para o client sempre respeita o contrato:

```javascript
import { SocketEvents } from "shared/socket";
import { isPlayableCard } from "shared/game";

/**
 * @param {import('shared').PlayCardPayload} payload
 */
function handlePlayCard(payload) {
  // ...
  io.to(roomId).emit(SocketEvents.SERVER_GAME_STATE, state);
}
```

## ⚠️ Regras Importantes

1. **Apenas JavaScript e JSDoc**: Este diretório não deve ser migrado para TypeScript (`.ts`). Utilize a sintaxe de `/** @typedef */` para as tipagens.
2. **Bibliotecas Agnósticas**: O código em `shared` deve rodar limpo em navegadores e no Node.js. Não insira dependências ou código atrelado estritamente ao DOM (ex: `window`, React) ou ao Node (ex: `fs`, Express).
3. **Fonte da Verdade**: Sempre consulte o arquivo `docs/db-mer.md` antes de alterar propriedades de uma entidade de domínio.
