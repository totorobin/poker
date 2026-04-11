import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      {
        find: '@poker/shared',
        replacement: fileURLToPath(new URL('../../packages/shared/index.ts', import.meta.url))
      }
    ]
  },
  plugins: [
    ElementPlus({}),
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://127.0.0.1:3000',
        ws: true
      }
    }
  }
})
