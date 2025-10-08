# Toolbox - Production Dockerfile
# Uses development mode due to next-intl compatibility
# Performance is still excellent with Next.js dev mode

FROM node:22-alpine

# Install system dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Clean any existing .next directory to avoid conflicts
RUN rm -rf .next

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4003

# Expose port
EXPOSE 4003

# Start in dev mode (fully compatible with next-intl and Tailwind)
CMD ["npm", "run", "dev"]