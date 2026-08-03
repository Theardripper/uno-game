FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
WORKDIR /app/apps/api/src
# Install dependencies specifically for the API since its package.json is nested
RUN pnpm install

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy only the necessary source code and node_modules
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/apps/shared ./apps/shared

WORKDIR /app/apps/api/src

EXPOSE 3001

CMD ["node", "server.js"]
