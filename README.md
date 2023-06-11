![vite-plugin-document](https://realme-ten.vercel.app/api/v1/banner?colorA=7c2d12&colorB=c2410c&textColor=fb923c&title=vite-plugin-document&subtitle=JiangWeixian&desc=Document.tsx%20as%20html%20template)

[![npm](https://img.shields.io/npm/v/vite-plugin-document)](https://github.com/JiangWeixian/vite-plugin-document) [![GitHub](https://img.shields.io/npm/l/vite-plugin-document)](https://github.com/JiangWeixian/vite-plugin-document) 

*use `Document.tsx` as html template.*

## install

```console
pnpm i vite-plugin-document -D
```

## usage

```tsx
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import document from 'vite-plugin-document'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), document()],
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

check [playground](/examples/) for more details

### solidjs

```tsx
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import document from 'vite-plugin-document'

// https://vitejs.dev/config/
export default defineConfig({
  // ssr: true is required
  plugins: [solid({ ssr: true }), document({ solidjs: true })],
})
```

### inline scripts

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `mark('head')`,
  }}
/>
```

## options

### `documentFilepath` 

Custom `Document.tsx` filepath

- type `string`
- default `<rootDir>/src/Document.tsx`

### `outDir`

In build mode, `vite-plugin-document` will bundle `<rootDir>/src/Document.tsx` into disk

- type `string`
- default `<rootDir>/.vite-document`

### `solidjs`

Current framework is `solidjs`, when `solidjs` is `undefined` automatic set to `true` if `vite-plugin-solid` is found in vite plugins list.

- type `boolean`
- default `<automatic detect>`

## development

- **Setup** - `pnpm i`
- **Build** - `pnpm build`

# 
<div align='right'>

*built with ❤️ by 😼*

</div>

