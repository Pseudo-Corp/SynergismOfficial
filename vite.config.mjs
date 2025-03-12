// @ts-check
import path from 'node:path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'Pictures/*',
          dest: 'Pictures'
        },
        {
          src: 'translations/*',
          dest: 'translations'
        },
        {
          src: 'Synergism.css',
          dest: ''
        },
        {
          src: 'favicon.ico',
          dest: ''
        }
      ]
    })
  ],
  build: {
    assetsInlineLimit: 0,
    assetsDir: '',
    emitAssets: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames (asset) {
          if (asset.names.includes('index.css')) {
            return 'Synergism.css'
          }

          return '[name]-[extname]'
        }
      }
    }
  }
})
