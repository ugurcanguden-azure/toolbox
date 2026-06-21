# Toolbox - Production Dockerfile
# Yarn-based multi-stage build for server deployment.

FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

FROM base AS deps

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN yarn build

FROM base AS runner

RUN apk add --no-cache curl tzdata

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV TZ=UTC
ENV NODE_OPTIONS=--max-old-space-size=1024

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

RUN node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json','utf8')); pkg.scripts={start:'node server.js'}; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));" && \
    chown nextjs:nodejs package.json

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost:3000/sitemap.xml > /dev/null || exit 1

CMD ["yarn", "start"]
