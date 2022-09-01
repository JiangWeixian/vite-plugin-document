![vite-plugin-document](https://realme-ten.vercel.app/api/v1/banner?colorA=7c2d12&colorB=c2410c&textColor=fb923c&title=vite-plugin-document&subtitle=NEO&desc=Document.tsx%20as%20html%20template)

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

### options

`documentFilepath` custom `Document.tsx` filepath, default is `root/src/Document.tsx`

- type `string`

## development

- **Setup** - `pnpm i`
- **Build** - `pnpm build`

# 
<div align='right'>

*built with ❤️ by 😼*

</div>

