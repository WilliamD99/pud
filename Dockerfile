# =========================================
# Base image
# =========================================
FROM node:22.17.0-alpine AS base

# =========================================
# Builder stage
# =========================================
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Prevent OOM during Next build
ENV NODE_OPTIONS="--no-deprecation --max-old-space-size=8000"

# Dummy build-time env vars (required by Payload / Next config)
ENV DATABASE_URI="postgresql://dummy:dummy@localhost:5432/dummy"
ENV PAYLOAD_SECRET="build-time-secret"
ENV S3_BUCKET="dummy-bucket"
ENV S3_BUCKET_PREFIX="dummy"
ENV AWS_ACCESS_KEY_ID="dummy"
ENV AWS_SECRET_ACCESS_KEY="dummy"
ENV AWS_REGION="us-east-1"

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm \
  && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# =========================================
# Production runner stage
# =========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Required for Next runtime cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy Next standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
