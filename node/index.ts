#!/usr/bin/env node

import { cmd, exp, load, m2fi, uniq } from "./utils";
import { createYargsArgv } from './cli'
import { logger } from "./log";

const argv: any = createYargsArgv().parse()

async function mainTryError() {
  await main().catch(error => {
    console.warn(`${error.message}`)
    process.exit()
  })
}
async function main() {
  if (!argv.e && !argv.r)
    throw new Error('Missing required --expose|-e or --run|-r options')

  if (argv.m && argv.r)
    throw new Error('In monorepo, the run script cannot be run')

  if (argv.e && argv.r)
    throw new Error('Expose and run cannot run simultaneously')

  const modes = [argv.d && 'env', ...(argv._ || []), argv.d && 'local', ...(argv.mode || [])]
  const files = uniq(modes).filter(Boolean).map(m2fi)

  const parsed: Record<string, string> = {}
  const parsedFiles: string[] = []

  for (const file of files) {
    const envs = load(file)
    if (!envs || envs?.error) {
      if (!(argv.d && (file === 'env' || file === 'env.local')))
        logger.log(`Failed to loading ${file} file not found in all scopes`)
      continue
    }
    Object.assign(parsed, envs.parsed)
    parsedFiles.unshift(file)
  }

  for (const kv of argv.v || []) {
    const [key, value] = kv.split('=')
    if (!key || typeof value === 'undefined')
      console.warn(`Invalid manual environment variable: ${kv}`)
    else
      parsed[key] = value || ''
  }

  if (!argv.v?.length && !files.length && !parsedFiles.length)
    console.warn('No environment variables loaded')

  const parsedMode = argv.e ? 'exposed' : 'loaded'
  const suffix = !argv.r
    ? argv.m ? 'packages by' : 'env'
    : 'runtime environment'
  let successfullyMessage = parsedFiles.length
    ? `Successfully ${parsedMode} ${parsedFiles.join('|')} to ${suffix}`
    : argv.v?.length ? `Successfully manual loaded environment variables`
      : ''

  if (argv.v) {
    parsedFiles.length && (successfullyMessage += ' with manual loaded variables')
    for (const kv of argv.v) {
      const [key, value] = kv.split('=')
      typeof value !== 'undefined' && (successfullyMessage += `\n  ${key}=${value}`)
    }
  }


  argv.r && (parsedFiles.length || argv.v) ? logger.log(successfullyMessage + '\n') : logger.log('')
  argv.r && await cmd(argv.r, parsed)
  argv.e && await exp(argv.m, parsed)
  argv.e && parsedFiles.length && logger.don(successfullyMessage)
}

mainTryError()
