// @ts-check

import * as esbuild from 'esbuild'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { parseArgs } from 'node:util'

const platforms = new Set(['browser', 'steam', 'mobile'])

/** @param {string} value */
const stripQuotes = (value) => value.replace(/^\\?["']|\\?["']$/g, '')

const { values } = parseArgs({
  options: {
    platform: {
      type: 'string',
      default: 'browser'
    },
    outfile: {
      type: 'string',
      default: './dist/out.js'
    },
    prod: {
      type: 'boolean',
      default: true
    },
    dev: {
      type: 'boolean',
      default: false
    },
    minify: {
      type: 'boolean',
      default: true
    },
    watch: {
      type: 'boolean',
      default: false
    },
    sourcemap: {
      type: 'boolean',
      default: false
    }
  },
  allowNegative: true
})

const options = {
  platform: stripQuotes(values.platform),
  outfile: stripQuotes(values.outfile),
  prod: values.prod,
  dev: values.dev
}

if (options.dev) {
  options.prod = false
}

if (options.prod) {
  options.dev = false
}

if (!platforms.has(options.platform)) {
  throw new Error(`Invalid platform "${options.platform}". Expected one of: ${[...platforms].join(', ')}`)
}

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: ['src/Synergism.ts'],
  bundle: true,
  minify: values.minify,
  target: ['chrome58', 'firefox57', 'safari11', 'edge29'],
  outfile: values.outfile,
  sourcemap: values.sourcemap,
  metafile: true,
  define: {
    PROD: `${options.prod}`,
    DEV: `${options.dev}`,
    PLATFORM: JSON.stringify(options.platform)
  },
  plugins: [bundleSummaryPlugin()]
}

if (values.watch) {
  const context = await esbuild.context(buildOptions)
  await context.watch()
  console.log(`Watching ${options.platform} build -> ${options.outfile}`)
} else {
  await esbuild.build(buildOptions)
}

/** @returns {import('esbuild').Plugin} */
function bundleSummaryPlugin () {
  let start = 0

  return {
    name: 'bundle-summary',
    setup (build) {
      build.onStart(() => {
        start = performance.now()
      })

      build.onEnd((result) => {
        if (result.errors.length > 0 || result.metafile === undefined) {
          return
        }

        for (const [file, output] of Object.entries(result.metafile.outputs)) {
          console.log(`${formatOutputPath(file)}  ${formatBytes(output.bytes)}`)
        }

        console.log(`\nDone in ${Math.round(performance.now() - start)}ms`)
      })
    }
  }
}

/** @param {string} file */
function formatOutputPath (file) {
  return path.normalize(file)
}

/** @param {number} bytes */
function formatBytes (bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)}mb`
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)}kb`
  }

  return `${bytes}b`
}
