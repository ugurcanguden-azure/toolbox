#!/bin/bash

# 🗜️ ASSET COMPRESSION SCRIPT
# Pre-compresses static assets for maximum performance
# Run this after build to create .gz and .br files

echo "🚀 Starting asset compression..."

# Create compressed directories
mkdir -p .next/static/gz
mkdir -p .next/static/br
mkdir -p public/gz
mkdir -p public/br

# 🎯 COMPRESS NEXT.JS STATIC FILES
echo "📦 Compressing Next.js static files..."

find .next/static -type f \( -name "*.js" -o -name "*.css" -o -name "*.json" \) | while read file; do
    # Gzip compression
    gzip -9 -c "$file" > "${file}.gz"
    
    # Brotli compression (if available)
    if command -v brotli &> /dev/null; then
        brotli -9 -c "$file" > "${file}.br"
    fi
    
    echo "✅ Compressed: $file"
done

# 🖼️ COMPRESS IMAGES
echo "🖼️ Compressing images..."

find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.svg" \) | while read file; do
    # Gzip compression for SVG
    if [[ "$file" == *.svg ]]; then
        gzip -9 -c "$file" > "${file}.gz"
        
        if command -v brotli &> /dev/null; then
            brotli -9 -c "$file" > "${file}.br"
        fi
    fi
    
    echo "✅ Compressed: $file"
done

# 📄 COMPRESS TEXT FILES
echo "📄 Compressing text files..."

find public -type f \( -name "*.txt" -o -name "*.xml" -o -name "*.json" -o -name "*.css" -o -name "*.js" \) | while read file; do
    # Gzip compression
    gzip -9 -c "$file" > "${file}.gz"
    
    # Brotli compression
    if command -v brotli &> /dev/null; then
        brotli -9 -c "$file" > "${file}.br"
    fi
    
    echo "✅ Compressed: $file"
done

# 🎨 COMPRESS FONTS
echo "🎨 Compressing fonts..."

find public -type f \( -name "*.woff" -o -name "*.woff2" -o -name "*.ttf" -o -name "*.otf" \) | while read file; do
    # Gzip compression
    gzip -9 -c "$file" > "${file}.gz"
    
    # Brotli compression
    if command -v brotli &> /dev/null; then
        brotli -9 -c "$file" > "${file}.br"
    fi
    
    echo "✅ Compressed: $file"
done

echo "🎉 Asset compression completed!"
echo "📊 Compression summary:"
echo "  - Gzip files: $(find . -name "*.gz" | wc -l)"
echo "  - Brotli files: $(find . -name "*.br" | wc -l)"

# 📈 SIZE COMPARISON
echo ""
echo "📈 Size comparison:"
echo "Original size: $(du -sh .next/static public | tail -1 | cut -f1)"
echo "Compressed size: $(du -sh .next/static public | tail -1 | cut -f1) (with .gz/.br files)"
