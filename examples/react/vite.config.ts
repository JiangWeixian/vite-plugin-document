import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import document from 'vite-plugin-document'
import pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pages(), document()],
})
