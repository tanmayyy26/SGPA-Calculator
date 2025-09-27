# Advanced Node Modules Optimization and Build Script (PowerShell)
# This script combines, optimizes, and bundles node_modules for minimal repository size

Write-Host "🚀 Starting Advanced Node Modules Optimization..." -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

try {
    # Step 1: Clean previous builds and caches
    Write-Status "Cleaning previous builds and caches..."
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }
    if (Test-Path "node_modules\.vite") { Remove-Item -Recurse -Force "node_modules\.vite" }
    if (Test-Path ".vite") { Remove-Item -Recurse -Force ".vite" }
    Write-Success "Cleanup completed"

    # Step 2: Install dependencies with optimization flags
    Write-Status "Installing dependencies with optimization flags..."
    npm ci --no-audit --no-fund --prefer-offline
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
    Write-Success "Dependencies installed"

    # Step 3: Run module optimization analysis
    Write-Status "Running module optimization analysis..."
    if (Test-Path "scripts\optimize-modules.js") {
        node scripts\optimize-modules.js
        if ($LASTEXITCODE -ne 0) { Write-Warning "Module optimization analysis had issues" }
        else { Write-Success "Module optimization analysis completed" }
    } else {
        Write-Warning "Module optimization script not found, skipping analysis"
    }

    # Step 4: Build with advanced optimization
    Write-Status "Building with advanced optimization..."
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    Write-Success "Build completed successfully"

    # Step 5: Analyze bundle size
    Write-Status "Analyzing bundle size..."
    if (Test-Path "dist") {
        Write-Host ""
        Write-Host "📊 Build Analysis:" -ForegroundColor Yellow
        Write-Host "=================="
        
        # Count files
        $totalFiles = (Get-ChildItem -Path "dist" -Recurse -File).Count
        Write-Host "Total files: $totalFiles"
        
        # Show largest files
        Write-Host ""
        Write-Host "🔍 Largest files in build:"
        Get-ChildItem -Path "dist" -Recurse -File | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
            $size = [math]::Round($_.Length / 1KB, 2)
            Write-Host "$size KB - $($_.Name)"
        }
        
        # Show chunk breakdown
        Write-Host ""
        Write-Host "📦 JavaScript chunks:"
        if (Test-Path "dist\assets\*.js") {
            Get-ChildItem -Path "dist\assets\*.js" | ForEach-Object {
                $size = [math]::Round($_.Length / 1KB, 2)
                Write-Host "$size KB - $($_.Name)"
            }
        } else {
            Write-Host "No JS chunks found"
        }
        
        Write-Host ""
        Write-Host "🎨 CSS files:"
        if (Test-Path "dist\assets\*.css") {
            Get-ChildItem -Path "dist\assets\*.css" | ForEach-Object {
                $size = [math]::Round($_.Length / 1KB, 2)
                Write-Host "$size KB - $($_.Name)"
            }
        } else {
            Write-Host "No CSS files found"
        }
        
        Write-Success "Bundle analysis completed"
    } else {
        throw "Build directory not found"
    }

    # Step 6: Generate optimization report
    Write-Status "Generating optimization report..."
    $reportContent = @"
Node Modules Optimization Report
Generated: $(Get-Date)
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
"@

    $reportContent | Out-File -FilePath "dist\optimization-report.txt" -Encoding UTF8
    Write-Success "Optimization report generated: dist\optimization-report.txt"

    # Step 7: Summary
    Write-Host ""
    Write-Host "✨ Optimization Complete!" -ForegroundColor Green
    Write-Host "========================"
    Write-Success "Your project is now optimized for repository upload!"
    Write-Host ""
    Write-Host "📋 What was optimized:"
    Write-Host "  ✅ Dependencies properly categorized (dev vs production)"
    Write-Host "  ✅ Advanced bundling with chunk splitting"
    Write-Host "  ✅ Aggressive minification and compression"
    Write-Host "  ✅ Tree shaking and dead code elimination"
    Write-Host "  ✅ Build analysis and reporting"
    Write-Host ""
    Write-Host "📤 Repository Upload Strategy:"
    Write-Host "  • node_modules is in .gitignore (not uploaded)"
    Write-Host "  • Only source code and config files uploaded"
    Write-Host "  • Users run 'npm install' to recreate node_modules"
    Write-Host "  • Production builds are highly optimized"
    Write-Host ""
    Write-Host "🚀 Ready for deployment!" -ForegroundColor Green

    # Optional: Mention bundle analysis if available
    if (Test-Path "dist\bundle-analysis.html") {
        Write-Status "Bundle analysis available at: dist\bundle-analysis.html"
    }

} catch {
    Write-Error $_.Exception.Message
    exit 1
}