/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
// @ts-nocheck
const Document = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="env.mode" content={import.meta.env.MODE === 'production' ? 'prod' : 'dev'} />
        <meta name="env.prod" content={import.meta.env.PROD ? 'prod' : 'dev'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  )
}

export default Document
