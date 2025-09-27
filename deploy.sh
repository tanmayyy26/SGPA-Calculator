#!/bin/bash

# GitHub Pages Optimized Deployment Script
# This script builds the project and creates a gh-pages branch for deployment

echo "🚀 Building project for GitHub Pages..."

# Clean previous build
rm -rf dist

# Install dependencies with optimized settings
echo "📦 Installing dependencies..."
npm ci --only=production --no-audit --no-fund

# Build the project with optimization
echo "🔨 Building optimized bundle..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

echo "✅ Build successful!"

# Show build size
echo "📊 Build size:"
du -sh dist/

# Create or checkout gh-pages branch
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages

# Remove all files except dist and important files
find . -maxdepth 1 ! -name 'dist' ! -name '.git' ! -name '.' ! -name '..' ! -name '.gitignore' -exec rm -rf {} +

# Move dist contents to root
mv dist/* .
rm -rf dist

# Create .nojekyll file to prevent Jekyll processing
touch .nojekyll

# Add and commit all files
git add .
git commit -m "Deploy optimized build to GitHub Pages - $(date)"

# Push to gh-pages branch
git push -f origin gh-pages

# Switch back to main branch
git checkout main

echo "🎉 Deployment complete! Your site should be live at:"
echo "https://tanmayyy26.github.io/SGPA-Calculator/"