![vite-plugin-document](https://realme-ten.vercel.app/api/v1/banner?colorA=7c2d12&colorB=c2410c&textColor=fb923c&title=vite-plugin-document&subtitle=JiangWeixian&desc=Document.tsx%20as%20html%20template)

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

create `src/Document.tsx` file, add follow code

```tsx
import React from 'react'

const Document = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  )
}

export default Document
```

check [playground](/playground/) for more details

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

