FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
# Install workspace dependencies
RUN pnpm install --frozen-lockfile

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Because pnpm uses symlinks in node_modules, we copy the root node_modules
# and the necessary workspace apps.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/[mock]\ api ./apps/[mock]\ api
COPY --from=builder /app/apps/shared ./apps/shared

WORKDIR /app/apps/[mock] api

EXPOSE 4000

CMD ["node", "index.js"]
