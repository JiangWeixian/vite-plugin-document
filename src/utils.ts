import path from 'node:path'
import { existsSync } from 'node:fs'

const DOCUMENT_FILES = ['Document.mjs', 'Document.cjs', 'Document.js']

export const resolveDistDocumentPath = (outDir: string, filenames = DOCUMENT_FILES) => {
  return filenames
    .map((filename) => path.resolve(outDir, filename))
    .find((filepath) => {
      return existsSync(filepath)
    })
}
