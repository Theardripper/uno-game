FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
# Copy the entire monorepo
COPY . .
# Install all dependencies (pnpm will read pnpm-workspace.yaml)
RUN pnpm install --frozen-lockfile
# Build only the frontend using turborepo
RUN pnpm run build --filter=frontend

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

# The standalone output includes all required dependencies from the monorepo root
# and recreates the folder structure.
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static

USER nextjs

EXPOSE 3000

# The standalone folder mirrors the workspace structure
CMD ["node", "apps/frontend/server.js"]
