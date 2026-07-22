# 🏛️ Arquitetura do Frontend (Next.js + Vanilla JS)

Nosso projeto utiliza uma adaptação do **Feature-Sliced Design (FSD)** para garantir que o jogo escale sem transformar o código em um "espaguete". A regra de ouro é: **o fluxo de dependência é unidirecional** (as camadas de cima importam as de baixo, mas nunca o contrário).

Abaixo está a explicação de cada pasta dentro de `src/`.

---

## 1. `app/` (O Roteador)
Camada exclusiva do Next.js (App Router). Contém **apenas** a definição de rotas, layouts principais e a proteção de páginas.
* **O que colocar aqui:** `page.jsx`, `layout.jsx`, `globals.css`.
* **O que NÃO colocar aqui:** Lógica de negócio, estados globais ou chamadas de API. O `page.jsx` apenas importa uma View e a renderiza.

## 2. `views/` (Os Orquestradores de Tela)
Páginas completas rodando no lado do cliente (`"use client"`). Elas servem como templates (Grid/Flexbox) para posicionar os blocos de interface.
* **O que colocar aqui:** `GameView.jsx`, `LobbyView.jsx`, `AuthView.jsx`.
* **Regra:** Views não devem ter regras de negócio, elas apenas juntam *Widgets* na tela.

## 3. `widgets/` (Blocos Independentes e Complexos)
Componentes autônomos que agregam várias features e entidades. Um Widget sabe ir até a *Store* buscar seus próprios dados.
* **Exemplos:** `<GameTable />` (A mesa inteira), `<ChatPanel />` (O chat completo), `<PlayerHand />` (Sua mão de cartas).

## 4. `features/` (Ações de Negócio)
Representam as funcionalidades que o usuário pode executar. Elas unem a **Lógica (Hook)** e a **Interface (UI)** daquela ação específica.
* **Exemplos:** * `play-card/` (O botão de jogar + validação de turno).
  * `call-uno/` (O botão vermelho de gritar UNO + hook que emite o evento pro servidor).

## 5. `entities/` (Elementos Visuais de Domínio)
Componentes visuais que representam conceitos do jogo, mas **sem lógica de negócio ou ações atreladas**. Eles apenas recebem `props` e renderizam algo bonito.
* **Exemplos:** `<Card />` (O visual da carta), `<PlayerAvatar />`, `<DirectionArrow />`.

## 6. `socket/` (Comunicação em Tempo Real)
O coração da comunicação com o servidor Node.js.
* **O que colocar aqui:** * `socketClient.js` (A instância única do Socket.io).
  * `handlers/` (Funções que escutam os eventos do servidor e mandam atualizar a Store, ex: `gameStateHandler.js`).

## 7. `store/` (Estado Global - Zustand)
Gerenciadores de estado que garantem a performance do React, evitando re-renderizações desnecessárias.
* **O que colocar aqui:** `useGameStore.js` (A mesa atual), `useAuthStore.js` (O jogador logado).

## 8. `animations/` (Efeitos e Áudio)
Isola as bibliotecas de animação e reprodução de som para não poluir a lógica de estado.
* **O que colocar aqui:** `SoundManager.js` (Toca o MP3 de compra de carta), e arquivos do Framer Motion com lógicas de *flip* e *shuffle*.

## 9. * **`services/`**: Funções que fazem o `fetch()` puro (Ex: `authService.js`).

## 10. * **`helpers/`**: Funções puras (Ex: formatadores de data, conversor de cores hexadecimais).

## 11. * **`hooks/`**: Hooks genéricos (Ex: `useLocalStorage.js`, `useDebounce.js`).
