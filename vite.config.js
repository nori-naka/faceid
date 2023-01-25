import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    watch: true
  },
  plugins: [vue()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync('./cert/server.key'),
      cert: fs.readFileSync('./cert/server.crt'),
    }
  }
})
