import { build as viteBuild } from 'vite'
import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { resolveDistDocumentPath } from './utils'
import debug from 'debug'

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

const VIRTUAL_HTML_ID = 'virtual-document.tsx'
const NAME = 'vite-plugin-document'

const log = {
  watcher: debug(`${NAME}:watcher`),
}

type Options = {
  documentFilePath?: string
  outDir?: string
}

export const VitePluginDocument = ({
  documentFilePath = '',
  outDir = '.vite-document',
}: Options = {}): Plugin => {
  const options: Required<Options> = {
    documentFilePath,
    outDir,
  }
  return {
    name: NAME,
    configResolved(config) {
      options.documentFilePath = documentFilePath || path.resolve(config.root, 'src/Document.tsx')
      options.outDir = path.resolve(config.root, options.outDir)
      if (!fs.existsSync(options.documentFilePath)) {
        console.error(`Document.tsx at ${options.documentFilePath} not exit!`)
      }
    },
    configureServer(server) {
      server.watcher.add(options.documentFilePath)
      server.watcher.on('all', async (_, filename) => {
        if (filename === options.documentFilePath) {
          log.watcher('%s changed full-reload', filename)
          const module = server.moduleGraph.getModuleById(VIRTUAL_HTML_ID)
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
          const doc = (await server.ssrLoadModule(VIRTUAL_HTML_ID)).default
          content = docType(renderToStaticMarkup(doc()))
          content = await server.transformIndexHtml?.(req.originalUrl!, content, req.originalUrl)
          res.end(content)
        })
      }
    },
    resolveId(id) {
      if (id === VIRTUAL_HTML_ID) {
        return options.documentFilePath
      }
      if (id.endsWith('.html')) {
        return id
      }
      return id
    },
    async load(id) {
      // in build mode, vite will try to load `index.html`
      if (id.endsWith('.html')) {
        await viteBuild({
          logLevel: 'error',
          build: {
            outDir: options.outDir,
            ssr: options.documentFilePath,
          },
        })
        const distDocumentFilePath = resolveDistDocumentPath(options.outDir)!
        const doc = await import(distDocumentFilePath).then((res) => res.default)
        content = docType(renderToStaticMarkup(doc()))
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
