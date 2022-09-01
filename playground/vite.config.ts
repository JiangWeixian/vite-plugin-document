import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginDocument } from 'vite-plugin-document'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePluginDocument()],
})
