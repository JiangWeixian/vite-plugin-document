import { existsSync } from 'node:fs'
import path from 'node:path'

import { VIRTUAL_REACT_HTML_ID, VIRTUAL_SOLID_HTML_ID } from './constants'

import type { ModuleFormat } from 'rollup'

const DOCUMENT_FILES = ['Document.mjs', 'Document.cjs', 'Document.js']

export const resolveDistDocumentPath = (outDir: string, filenames = DOCUMENT_FILES) => {
  return filenames
    .map(filename => path.resolve(outDir, filename))
    .find((filepath) => {
      return existsSync(filepath)
    })
}

export type SupportedFramework = 'react' | 'solid'

export const renderDocument = async (element: any, framework: SupportedFramework = 'react') => {
  if (framework === 'react') {
    const { renderToStaticMarkup: render } = await import('react-dom/server')
    return render(element())
  }
  if (framework === 'solid') {
    const { renderToString: render, createComponent } = await import('solid-js/web')
    return render(() =>
      createComponent(element, {}),
    )
  }
  return ''
}

export const resolvePlugins = async (framework: SupportedFramework) => {
  if (framework === 'react') {
    return []
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  const solid = await import('vite-plugin-solid').then(res => res.default)
  return [solid({ ssr: true, solid: { generate: 'ssr', hydratable: false } })]
}

export const resolveVirtualHtmlId = (framework: SupportedFramework) => {
  if (framework === 'react') {
    return VIRTUAL_REACT_HTML_ID
  }
  if (framework === 'solid') {
    return VIRTUAL_SOLID_HTML_ID
  }
  return VIRTUAL_REACT_HTML_ID
}

export const getContextFormat = (metaUrl: string): ModuleFormat => {
  const ext = path.extname(metaUrl)
  if (ext === '.ts' || ext === '.mjs') {
    return 'es'
  }
  return 'cjs'
}
