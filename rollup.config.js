import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { externals } from 'rollup-plugin-node-externals'
import alias from '@rollup/plugin-alias'
import size from 'rollup-plugin-filesize'
import ce from 'rollup-plugin-condition-exports'
import { defineConfig } from 'rollup'

export default defineConfig([
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    plugins: [
      /**
       * Bundle devDependencies, exclude dependencies
       */
      externals({
        devDeps: false,
      }),
      commonjs(),
      typescript({
        // rollup-plugin-typescript2 can not process alias on emit types
        // require ttypescript tranform alias
        typescript: require('ttypescript'),
      }),
      alias({
        resolve: ['.ts', '.js', '.tsx', '.jsx'],
        entries: [{ find: '@/', replacement: './src/' }],
      }),
      resolve(),
      /**
       * Auto setup package.json
       * @see {@link https://github.com/JiangWeixian/rollup-plugin-condition-exports}
       */
      ce(),
      size(),
    ],
    output: [
      { dir: 'dist', entryFileNames: '[name].cjs', format: 'cjs' },
      { dir: 'dist', entryFileNames: '[name].mjs', format: 'es' },
    ],
  },
])
