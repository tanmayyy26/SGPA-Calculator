import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  base: '/SGPA-Calculator/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild instead of terser for now
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries - most stable
          'react-vendor': ['react', 'react-dom'],
          
          // Animation libraries - moderate update frequency
          'animation-libs': ['framer-motion', '@react-spring/web'],
          
          // Utility libraries - least likely to change
          'utility-libs': ['ogl', 'react-confetti-boom'],
          
          // CSS frameworks - separate chunk for caching
          'styles': ['bootstrap']
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Advanced bundling options
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false
      }
    },
    chunkSizeWarningLimit: 800,
    target: 'esnext'
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'framer-motion',
      '@react-spring/web',
      'ogl',
      'react-confetti-boom',
      'bootstrap'
    ],
    exclude: []
  }
})
