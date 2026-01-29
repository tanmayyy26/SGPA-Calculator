#!/bin/bash

# Advanced Node Modules Optimization and Build Script
# This script combines, optimizes, and bundles node_modules for minimal repository size

set -e  # Exit on any error

echo "🚀 Starting Advanced Node Modules Optimization..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Clean previous builds and caches
print_status "Cleaning previous builds and caches..."
rm -rf dist/
rm -rf node_modules/.cache/
rm -rf node_modules/.vite/
rm -rf .vite/
print_success "Cleanup completed"

# Step 2: Install dependencies with optimization flags
print_status "Installing dependencies with optimization flags..."
npm ci --no-audit --no-fund --prefer-offline
print_success "Dependencies installed"

# Step 3: Run module optimization analysis
print_status "Running module optimization analysis..."
if [ -f "scripts/optimize-modules.js" ]; then
    node scripts/optimize-modules.js
    print_success "Module optimization analysis completed"
else
    print_warning "Module optimization script not found, skipping analysis"
fi

# Step 4: Build with advanced optimization
print_status "Building with advanced optimization..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 5: Analyze bundle size
print_status "Analyzing bundle size..."
if [ -d "dist" ]; then
    echo ""
    echo "📊 Build Analysis:"
    echo "=================="
    
    # Count files
    total_files=$(find dist -type f | wc -l)
    echo "Total files: $total_files"
    
    # Show largest files
    echo ""
    echo "🔍 Largest files in build:"
    find dist -type f -exec ls -la {} + | sort -k5 -nr | head -10 | awk '{print $5, $9}'
    
    # Show chunk breakdown
    echo ""
    echo "📦 JavaScript chunks:"
    ls -la dist/assets/*.js 2>/dev/null || echo "No JS chunks found"
    
    echo ""
    echo "🎨 CSS files:"
    ls -la dist/assets/*.css 2>/dev/null || echo "No CSS files found"
    
    print_success "Bundle analysis completed"
else
    print_error "Build directory not found"
    exit 1
fi

# Step 6: Generate optimization report
print_status "Generating optimization report..."
cat > dist/optimization-report.txt << EOF
Node Modules Optimization Report
Generated: $(date)
================================

Build Configuration:
- Vite bundler with advanced optimization
- Terser minification with 2 passes
- Tree shaking enabled
- Code splitting with manual chunks
- Gzip compression enabled
- Console/debugger statements removed

Chunk Strategy:
- react-vendor: Core React libraries (most stable)
- animation-libs: Framer Motion, React Spring (moderate updates)
- utility-libs: OGL, Confetti (least likely to change)
- styles: Bootstrap (separate for caching)

Optimization Features:
✅ Advanced tree shaking
✅ Dead code elimination
✅ Aggressive minification
✅ Chunk splitting for optimal caching
✅ Gzip compression
✅ Source map removal
✅ Console/debugger removal

Repository Benefits:
- node_modules excluded from git
- Production bundle highly optimized
- Efficient chunk caching strategy
- Minimal network transfer size

Next Steps:
1. Commit optimized configuration files
2. Use 'npm run build:optimized' for production
3. Deploy only the 'dist' folder
4. Users can recreate node_modules with 'npm install'
EOF

print_success "Optimization report generated: dist/optimization-report.txt"

# Step 7: Summary
echo ""
echo "✨ Optimization Complete!"
echo "========================"
print_success "Your project is now optimized for repository upload!"
echo ""
echo "📋 What was optimized:"
echo "  ✅ Dependencies properly categorized (dev vs production)"
echo "  ✅ Advanced bundling with chunk splitting"
echo "  ✅ Aggressive minification and compression"
echo "  ✅ Tree shaking and dead code elimination"
echo "  ✅ Build analysis and reporting"
echo ""
echo "📤 Repository Upload Strategy:"
echo "  • node_modules is in .gitignore (not uploaded)"
echo "  • Only source code and config files uploaded"
echo "  • Users run 'npm install' to recreate node_modules"
echo "  • Production builds are highly optimized"
echo ""
echo "🚀 Ready for deployment!"

# Optional: Open bundle analysis if available
if [ -f "dist/bundle-analysis.html" ]; then
    print_status "Bundle analysis available at: dist/bundle-analysis.html"
fi