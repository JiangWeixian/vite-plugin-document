import { existsSync } from 'node:fs'
import path from 'node:path'

import { build, createServer } from 'vite'
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest'

import { VitePluginDocument } from '../src/index'
import { getContextFormat } from '../src/utils'

import type { ViteDevServer } from 'vite'

const f = (filepath = '') => path.resolve(__dirname, './fixtures', filepath)

describe('utils', () => {
  it('getContextFormat', () => {
    expect(getContextFormat(import.meta.url)).toBe('es')
  })
})

describe('basic', () => {
  let server: ViteDevServer
  let code: string | undefined
  beforeAll(async () => {
    server = await createServer({
      root: f('react'),
      logLevel: 'error',
      server: {
        hmr: {
          port: 24679,
        },
      },
      plugins: [
        VitePluginDocument({
          documentFilePath: f('react/Document.tsx'),
        }),
      ],
    })
    const result = await server.transformRequest('index.html')
    code = result?.code
  })
  afterAll(async () => {
    await server.close()
  })

  it('document snapshot', async () => {
    expect(code).toMatchSnapshot('Document.tsx')
  })

  it('options: { outDir: .document }', async () => {
    await build({
      root: f('react'),
      logLevel: 'silent',
      plugins: [
        VitePluginDocument({
          documentFilePath: f('react/Document.tsx'),
          outDir: '.document',
        }),
      ],
    })
    const exit = existsSync(f('react/.document/Document.mjs'))
    expect(exit).toBe(true)
  })
})

describe('react', () => {
  it('shout emit dist document filepath', async () => {
    await build({
      root: f('react'),
      logLevel: 'silent',
      plugins: [
        VitePluginDocument({
          documentFilePath: f('react/Document.tsx'),
        }),
      ],
    })
    const exit = existsSync(f('react/.vite-document/Document.mjs'))
    expect(exit).toBe(true)
  })
})

describe('solidjs', () => {
  it('shout emit dist document filepath', async () => {
    await build({
      root: f('solid'),
      logLevel: 'silent',
      configFile: f('solid/vite.config.ts'),
      plugins: [
        VitePluginDocument(),
      ],
    })
    const exit = existsSync(f('solid/.vite-document/Document.mjs'))
    expect(exit).toBe(true)
  })
})
