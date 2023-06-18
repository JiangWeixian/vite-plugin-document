import { defineConfig } from 'vite'
import document from 'vite-plugin-document'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid({ ssr: true }), document({ solidjs: true })],
  build: {
    target: 'esnext',
  },
})
