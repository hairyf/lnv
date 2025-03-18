import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig((_options) => {
  return {
    entry: ['./src'],
    clean: true,
    dts: true,
    format: ['esm'],
    // minify: !options.watch,
    external: Object.keys(pkg.dependencies || {}),

    /**
     * @see https://tsup.egoist.dev/#inject-cjs-and-esm-shims
     * shim for __filename
     */
    shims: true,
    /**
     * @see https://github.com/egoist/tsup/discussions/505
     */
    banner: ({ format }) => {
      if (format === 'esm') {
        return {
          js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import\.meta.url);`,
        }
      }
    },
  }
})
