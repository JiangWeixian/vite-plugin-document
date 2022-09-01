# vite-plugin-document

[![npm](https://img.shields.io/npm/v/vite-plugin-document)](https://github.com/JiangWeixian/vite-plugin-document) [![GitHub](https://img.shields.io/npm/l/vite-plugin-document)](https://github.com/JiangWeixian/vite-plugin-document) 

*use `Document.tsx` as html template.*

## install

```console
pnpm i vite-plugin-document
```

## usage

```tsx
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginDocument } from 'vite-plugin-document'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePluginDocument()],
})
```

## development

- **Setup** - `pnpm i`
- **Build** - `pnpm build`

# 
<div align='right'>

*built with ❤️ by 😼*

</div>

