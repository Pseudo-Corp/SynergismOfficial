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
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  assetsInclude: ['**/*.js', '**/*.css', '**/*.html']
})
