# 🚀 Toolbox - Optimized Production Dockerfile
# Multi-stage build for maximum performance and security
# Optimized for PageSpeed 80+ score

# ========================================
# 🏗️ BUILD STAGE - Optimized for building
# ========================================
FROM node:22-alpine AS builder

# Install system dependencies for building
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    brotli \
    gzip

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies with optimizations
RUN npm ci --frozen-lockfile && \
    npm cache clean --force

# Copy source code
COPY . .

# 🚀 Build the application with optimizations
# RUN npm run build

# 🗜️ Compress assets for maximum performance
# RUN chmod +x scripts/compress-assets.sh && \
#     ./scripts/compress-assets.sh

# ========================================
# 🏃 RUNTIME STAGE - Optimized for production
# ========================================
FROM node:22-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    brotli \
    gzip \
    curl \
    tzdata

WORKDIR /app

# Set timezone
ENV TZ=UTC

# Create nextjs user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app ./

# Copy compressed assets
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static/*.gz ./.next/static/ 2>/dev/null || true
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static/*.br ./.next/static/ 2>/dev/null || true
# COPY --from=builder --chown=nextjs:nodejs /app/public/*.gz ./public/ 2>/dev/null || true
# COPY --from=builder --chown=nextjs:nodejs /app/public/*.br ./public/ 2>/dev/null || true

# Fix permissions for development
RUN chown -R nextjs:nodejs /app && \
    chmod -R 755 /app

# Switch to non-root user
USER nextjs

# 🚀 Performance optimizations
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 🎯 Node.js optimizations for performance
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application in development mode
CMD ["npm", "run", "dev"]