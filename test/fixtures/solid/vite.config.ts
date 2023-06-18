import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

import document from '../../../src/index'

export default defineConfig({
  plugins: [
    solid({ ssr: true }),
    document(),
  ],
})
