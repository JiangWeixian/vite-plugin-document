import { describe, it, expect } from 'vitest'
import { build, createServer } from 'vite'
import { VitePluginDocument } from '../src/index'
import path from 'node:path'
import { existsSync } from 'fs'

const f = (filepath = '') => path.resolve(__dirname, './fixtures', filepath)

describe('basic', () => {
  it('shout emit dist document filepath', async () => {
    await build({
      root: f('basic'),
      logLevel: 'silent',
      plugins: [
        VitePluginDocument({
          documentFilePath: f('basic/Document.tsx'),
        }),
      ],
    })
    const exit = existsSync(f('basic/.vite-document/Document.mjs'))
    expect(exit).toBe(true)
  })

  // it('document snapshot', async () => {
  //   const server = await createServer({
  //     root: f('basic'),
  //     logLevel: 'silent',
  //     plugins: [
  //       VitePluginDocument({
  //         documentFilePath: f('basic/Document.tsx'),
  //       }),
  //     ],
  //   })
  //   const result = await server.transformRequest('index.html')
  //   expect(result).toBeDefined()
  //   expect(result!.code).toMatchSnapshot('Document.tsx')
  // })

  it('options: { outDir: .document }', async () => {
    await build({
      root: f('basic'),
      logLevel: 'silent',
      plugins: [
        VitePluginDocument({
          documentFilePath: f('basic/Document.tsx'),
          outDir: '.document',
        }),
      ],
    })
    const exit = existsSync(f('basic/.document/Document.mjs'))
    expect(exit).toBe(true)
  })
})
