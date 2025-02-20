#!/usr/bin/env node

import { cmd, exp, load, m2fi, uniq } from "./utils";
import { createYargsArgv } from './cli'
import { logger } from "./log";

const argv: any = createYargsArgv().parse()

async function mainTryError() {
  await main().catch(error => {
    console.warn(`LNV Error: ${error.message}`)
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

  const modes = [argv.d && 'env', ...(argv._ || []), argv.d && 'local']
  const files = uniq(modes).filter(Boolean).map(m2fi)

  if (!files.length)
    throw new Error(`Please enter lnv <modes> the loading mode`)

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

  const parsedMode = argv.e ? 'exposed' : 'loaded'
  const suffix = !argv.r
    ? argv.m ? 'packages by' : 'env'
    : 'runtime environment'
  const successfullyMessage = `Successfully ${parsedMode} ${parsedFiles.join('|')} to ${suffix}`

  argv.r && logger.log(successfullyMessage + '\n')
  argv.r && await cmd(argv.r, parsed)
  argv.e && await exp(argv.m, parsed)
  argv.e && logger.don(successfullyMessage)
}

mainTryError()
