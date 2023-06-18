import fs from 'node:fs'
import path from 'node:path'

import debug from 'debug'
import { build as viteBuild } from 'vite'

import {
  NAME,
  VIRTUAL_DOCUMENT_ID,
  VIRTUAL_REACT_HTML_ID,
  VIRTUAL_SOLID_HTML_ID,
} from './constants'
import {
  getContextFormat,
  renderDocument,
  resolveDistDocumentPath,
  resolvePlugins,
  resolveVirtualHtmlId,
} from './utils'

import type { Plugin } from 'vite'
import type { SupportedFramework } from './utils'

let content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
const docType = (content: string) => `<!DOCTYPE html>${content}`

const log = {
  watcher: debug(`${NAME}:watcher`),
}

interface Options {
  documentFilePath?: string
  outDir?: string
  solidjs?: boolean
}

interface ResolvedOptions extends Omit<Required<Options>, 'solidjs'> {
  framework: SupportedFramework
  configFile: string
  plugins: Plugin[]
}

export const VitePluginDocument = ({
  documentFilePath = '',
  outDir = '.vite-document',
  solidjs,
}: Options = {}): Plugin => {
  const options = {} as ResolvedOptions
  return {
    name: NAME,
    async configResolved(config) {
      options.documentFilePath = documentFilePath || path.resolve(config.root, 'src/Document.tsx')
      options.outDir = path.resolve(config.root, outDir)
      options.framework = (solidjs ?? config.plugins?.find(p => p.name === 'solid')) ? 'solid' : 'react'
      options.configFile = config.configFile!
      options.plugins = await resolvePlugins(options.framework)
      if (!fs.existsSync(options.documentFilePath)) {
        console.error(`Document.tsx at ${options.documentFilePath} not exit!`)
      }
    },
    configureServer(server) {
      server.watcher.add(options.documentFilePath)
      server.watcher.on('all', async (_, filename) => {
        if (filename === options.documentFilePath) {
          log.watcher('%s changed full-reload', filename)
          const module = server.moduleGraph.getModuleById(VIRTUAL_DOCUMENT_ID)
          module && server.moduleGraph.invalidateModule(module!)
          if (server.ws) {
            server.ws.send({
              type: 'full-reload',
              path: '*',
            })
          }
        }
      })
      return () => {
        server.middlewares.use(async (req, res) => {
          // TODO: should hackfix vite-plugin-solid code
          const id = resolveVirtualHtmlId(options.framework)
          const doc = (await server.ssrLoadModule(id)).render
          content = docType(await doc())
          content = await server.transformIndexHtml?.(req.originalUrl!, content, req.originalUrl)
          res.end(content)
        })
      }
    },
    resolveId(id) {
      if (id === VIRTUAL_DOCUMENT_ID) {
        return options.documentFilePath
      }

      if (id.endsWith('.html')) {
        return id
      }

      return id
    },
    async load(id) {
      if (VIRTUAL_SOLID_HTML_ID === id) {
        return `
import doc from '${VIRTUAL_DOCUMENT_ID}'
import { renderToString, createComponent } from 'solid-js/web'
export const render = () => {
  return renderToString(() =>
    createComponent(doc, {}),
  )
}
        `
      }
      if (VIRTUAL_REACT_HTML_ID === id) {
        return `
import doc from '${VIRTUAL_DOCUMENT_ID}'
import { renderToStaticMarkup } from 'react-dom/server'
export const render = () => {
  return renderToStaticMarkup(doc())
}
          `
      }
      // in build mode, vite will try to load `index.html`
      if (id.endsWith('.html')) {
        await viteBuild({
          logLevel: 'error',
          plugins: options.plugins,
          build: {
            outDir: options.outDir,
            ssr: options.documentFilePath,
            minify: false,
            rollupOptions: {
              output: {
                format: getContextFormat(import.meta.url),
              },
            },
          },
        })
        const distDocumentFilePath = resolveDistDocumentPath(options.outDir)!
        const doc = await import(distDocumentFilePath).then((res: any) => res.default ?? res)
        content = docType(await renderDocument(doc, options.framework))
        return {
          code: content,
          // https://rollupjs.org/guide/en/#source-code-transformations
          map: null,
        }
      }
      return null
    },
  }
}

export default VitePluginDocument
