import { Plugin, createServer } from 'vite'
import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
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
}

export const VitePluginDocument = ({ documentFilePath = '' }: Options = {}): Plugin => {
  const options: Required<Options> = {
    documentFilePath,
  }
  return {
    name: NAME,
    configResolved(config) {
      options.documentFilePath = path.resolve(config.root, 'src/Document.tsx')
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
          server.moduleGraph.invalidateModule(module!)
          if (server.ws) {
            server.ws.send({
              type: 'full-reload',
              path: '*',
            })
          }
        }
      })
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // if not html, next it.
          if (!req.originalUrl?.endsWith('.html') && req.originalUrl !== '/') {
            return next()
          }
          const doc = (await server.ssrLoadModule(VIRTUAL_HTML_ID)).default
          content = docType(renderToString(doc()))
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
        const server = await createServer({
          server: { middlewareMode: true },
        })
        const doc = (await server.ssrLoadModule(VIRTUAL_HTML_ID)).default
        content = docType(renderToString(doc()))
        server.close()
        return content
      }
      return null
    },
  }
}
