import { Plugin, createServer } from 'vite'
import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'

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

export const VitePluginDocument = (): Plugin => {
  return {
    name: 'vite-plugin-document',
    configureServer(server) {
      server.watcher.add(path.resolve('./Document.tsx'))
      server.watcher.on('all', async (_, filename) => {
        if (filename.endsWith('Document.tsx')) {
          console.log('change', filename)
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
            console.log(req.originalUrl)
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
        return VIRTUAL_HTML_ID
      }
      if (id.endsWith('.html')) {
        return id
      }
      return id
    },
    async load(id) {
      if (id === VIRTUAL_HTML_ID) {
        const content = fs.readFileSync(path.resolve('./Document.tsx')).toString('utf-8')
        return content
      }
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
