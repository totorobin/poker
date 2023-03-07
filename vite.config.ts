import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
      ElementPlus({
        // options
      }),
      vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(),        IconsResolver({
        prefix: 'Icon',
      }),],
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver({
        enabledCollections: ['ep'],
      }),],
    }),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
