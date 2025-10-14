#!/bin/bash

# 🚀 Optimized Docker Build Script
# Builds and optimizes the Docker image for maximum performance

set -e

echo "🐳 Starting optimized Docker build..."

# 🎯 Configuration
IMAGE_NAME="toolbox-app"
TAG="latest"
BUILD_ARGS=""

# 🚀 Build arguments for optimization
BUILD_ARGS="--build-arg NODE_ENV=production"
BUILD_ARGS="$BUILD_ARGS --build-arg NEXT_TELEMETRY_DISABLED=1"

# 🧹 Clean up previous builds
echo "🧹 Cleaning up previous builds..."
docker system prune -f
docker builder prune -f

# 🏗️ Build the image with optimizations
echo "🏗️ Building optimized Docker image..."
docker build \
    --target runner \
    --tag $IMAGE_NAME:$TAG \
    --tag $IMAGE_NAME:$(date +%Y%m%d-%H%M%S) \
    $BUILD_ARGS \
    --compress \
    --no-cache \
    .

# 📊 Image size analysis
echo "📊 Image size analysis:"
docker images $IMAGE_NAME:$TAG --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# 🔍 Image layers analysis
echo "🔍 Image layers analysis:"
docker history $IMAGE_NAME:$TAG --format "table {{.CreatedBy}}\t{{.Size}}"

# 🚀 Performance test
echo "🚀 Starting performance test..."
docker run --rm -d --name toolbox-test -p 3001:3000 $IMAGE_NAME:$TAG

# Wait for container to start
sleep 10

# Health check
echo "🔍 Health check..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    docker logs toolbox-test
    docker stop toolbox-test
    exit 1
fi

# Performance test with curl
echo "📊 Performance test..."
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/ || true

# Stop test container
docker stop toolbox-test

echo "🎉 Docker build completed successfully!"
echo "📦 Image: $IMAGE_NAME:$TAG"
echo "🚀 Ready for deployment!"

# 🚀 Deployment commands
echo ""
echo "🚀 Deployment commands:"
echo "  docker run -d --name toolbox-prod -p 3000:3000 $IMAGE_NAME:$TAG"
echo "  docker-compose up -d"
echo "  docker-compose up -d --profile nginx  # With NGINX"