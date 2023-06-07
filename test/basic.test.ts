import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { ViteDevServer, build, createServer } from 'vite'
import { VitePluginDocument } from '../src/index'
import path from 'node:path'
import { existsSync } from 'fs'

const f = (filepath = '') => path.resolve(__dirname, './fixtures', filepath)

describe('basic', () => {
  let server: ViteDevServer
  let code: string | undefined
  beforeAll(async () => {
    server = await createServer({
      root: f('basic'),
      logLevel: 'error',
      server: {
        hmr: {
          port: 24679,
        },
      },
      plugins: [
        VitePluginDocument({
          documentFilePath: f('basic/Document.tsx'),
        }),
      ],
    })
    const result = await server.transformRequest('index.html')
    code = result?.code
  })
  afterAll(async () => {
    await server.close()
  })
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

  it('document snapshot', async () => {
    expect(code).toMatchSnapshot('Document.tsx')
  })

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
