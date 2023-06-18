import { renderToString, createComponent } from 'solid-js/web'
import doc from './.vite-document/Document.mjs'

console.log(
  renderToString(() =>
    createComponent(doc, {
      get url() {
        // return req.url
      },
    }),
  ),
)
