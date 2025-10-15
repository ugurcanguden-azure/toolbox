#!/bin/bash

echo "📦 Creating production deployment package..."

# Create deployment directory
rm -rf deployment-package
mkdir -p deployment-package

# Copy standalone build
echo "📁 Copying standalone build..."
cp -r .next/standalone/. deployment-package/

# Copy static files
echo "📁 Copying static assets..."
mkdir -p deployment-package/.next/static
cp -r .next/static deployment-package/.next/

# Copy public files
echo "📁 Copying public files..."
cp -r public deployment-package/

# Create startup script
cat > deployment-package/start.sh << 'START'
#!/bin/bash

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export PORT=3000
export NEXT_PUBLIC_SITE_URL=https://free-dev-tools.net.tr

node server.js
START

chmod +x deployment-package/start.sh

# Create PM2 ecosystem file
cat > deployment-package/ecosystem.config.js << 'PM2'
module.exports = {
  apps: [{
    name: 'toolbox',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      PORT: 3000,
      NEXT_PUBLIC_SITE_URL: 'https://free-dev-tools.net.tr'
    }
  }]
}
PM2

# Create README
cat > deployment-package/README.md << 'README'
# 🚀 Toolbox Deployment Package

## Quick Start

### 1. Upload to Server
```bash
scp -r deployment-package/ user@server:/var/www/toolbox/
```

### 2. Start Application

#### Option A: Using PM2 (Recommended)
```bash
cd /var/www/toolbox/deployment-package
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Option B: Using start script
```bash
cd /var/www/toolbox/deployment-package
./start.sh
```

#### Option C: Direct node
```bash
cd /var/www/toolbox/deployment-package
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export PORT=3000
export NEXT_PUBLIC_SITE_URL=https://free-dev-tools.net.tr
node server.js
```

## Files Included
- `.next/` - Built application
- `public/` - Static assets
- `node_modules/` - Production dependencies (already included)
- `server.js` - Next.js server
- `start.sh` - Startup script
- `ecosystem.config.js` - PM2 configuration

## Requirements
- Node.js 18+
- Port 3000 available

## NGINX Configuration
Copy the nginx.conf from the repository if using NGINX as reverse proxy.

## Verify
```bash
curl http://localhost:3000/en
```
README

# Create archive
echo "🗜️ Creating archive..."
tar -czf toolbox-deployment.tar.gz -C deployment-package .

echo "✅ Deployment package created!"
echo "📦 File: toolbox-deployment.tar.gz"
echo "📊 Size: $(du -h toolbox-deployment.tar.gz | cut -f1)"
echo ""
echo "🚀 Upload to server:"
echo "   scp toolbox-deployment.tar.gz user@server:/var/www/"
echo ""
echo "🔧 On server:"
echo "   cd /var/www/"
echo "   mkdir -p toolbox"
echo "   tar -xzf toolbox-deployment.tar.gz -C toolbox/"
echo "   cd toolbox"
echo "   pm2 start ecosystem.config.js"
