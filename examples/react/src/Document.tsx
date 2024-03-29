import { title } from './constants'

const Document = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="env.mode" content={import.meta.env.MODE === 'production' ? 'prod' : 'dev'} />
        <meta name="env.prod" content={import.meta.env.PROD ? 'prod' : 'dev'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${title}`}</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  )
}

export default Document
