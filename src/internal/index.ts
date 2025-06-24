/* eslint-disable no-console */
import type { DotenvConfigOutput } from 'dotenv'
import type { Command, Script, SelectCommand, UserConfig } from '../types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { intro, isCancel, outro, select } from '@clack/prompts'
import { colors } from 'consola/utils'
import { config } from 'dotenv'
import spawn from 'nano-spawn'
import { createSpinner } from 'nanospinner'
import { loadConfig } from 'unconfig'
import { readfile, readfiles, replaceLiteralQuantity } from '../utils'
import { entryToFile, uniq } from './utils'

export const context = {
  entries: [] as string[],
  env: {} as Record<string, string>,
  before: {} as Record<string, string>,
  after: {} as Record<string, string>,
  run: [] as string | string[],
  parsed: {} as Record<string, string>,
  parsedFiles: [] as string[],

  write: false,
  depth: false,

  script: undefined as Script | undefined,

  userConfig: {} as UserConfig,

  files: [] as string[],

  sources: [] as {
    env: string
    files: string[]
    scope: string | undefined
  }[],
}

export async function parseUserConfig(): Promise<void> {
  const { config = {} } = await loadConfig<UserConfig>({
    sources: [{ files: 'lnv.config' }],
    cwd: process.cwd(),
    merge: true,
  })

  context.script = config.scripts?.[context.entries[0] as string] as Script
  context.entries = context.script
    ? context.entries.slice(1)
    : context.entries

  Object.assign(context.before, config.injects?.before)
  Object.assign(context.after, config.injects?.after)
  context.entries.unshift(...(config.injects?.entries || []))
  context.depth = context.depth || config.injects?.depth || false
}

export async function executionScript(): Promise<void> {
  if (!context.script)
    return
  if (typeof context.script === 'string') {
    context.run = context.script
    return
  }
  const {
    prompts = [],
    entries = [],
    command: run,
    depth = false,
    message,
    before,
    after,
    ...selectOptions
  } = context.script as Command & SelectCommand

  Object.assign(context.before, before)
  Object.assign(context.after, after)
  context.entries.unshift(...entries)
  context.depth = context.depth || depth

  if (run && typeof selectOptions.options === 'undefined') {
    intro(message)
    const parsed: Record<string, string> = {}
    for (const prompt of prompts) {
      const { key, message, options } = prompt
      const choices = typeof options === 'function'
        ? await options()
        : options
      const value = await select({
        message: message || `Please select ${key}`,
        options: choices,
      })
      if (isCancel(value)) {
        outro('Operation cancelled')
        process.exit(0)
      }
      parsed[key] = value
    }
    Object.assign(context.parsed, parsed)
    context.run = run
    return
  }

  const value = await select({
    message: message || 'Please select a command',
    ...selectOptions,
  })
  if (isCancel(value)) {
    outro('Operation cancelled')
    process.exit(0)
  }
  context.run = value
}

export async function authEnvironment(): Promise<void> {
  const [environment] = context.sources.filter(source => source.env.startsWith('.env.vault'))

  if (!environment || !environment.files.length || process.env.DOTENV_KEY)
    return

  const unauthorizedFilepaths: string[] = []
  const notSpecifiedFilepaths: string[] = []

  for (const filepath of environment.files) {
    const dirpath = path.dirname(filepath)

    if (!dokey(dirpath, environment.scope)) {
      if (fs.existsSync(path.join(dirpath, '.env.me')))
        notSpecifiedFilepaths.push(filepath)
      else
        unauthorizedFilepaths.push(filepath)
      continue
    }
  }

  if (!unauthorizedFilepaths.length && !notSpecifiedFilepaths.length)
    return

  if (unauthorizedFilepaths.length)
    intro(`Found ${unauthorizedFilepaths.length} unauthorized directories, Please authorize them to access the vault environment variables.`)

  const spinner = createSpinner()
  spinner.start(' Pulling dotenv-vault...')
  await spawn('npx dotenv-vault help')
  spinner.stop()

  for (const filepath of unauthorizedFilepaths) {
    const dirpath = path.dirname(filepath)
    console.log(`${colors.dim(`entry:    `)}${filepath}`)

    await spawn('npx dotenv-vault login', {
      cwd: dirpath,
      stdio: 'inherit',
      stderr: 'inherit',
      stdin: 'inherit',
      stdout: 'inherit',
    })

    process.stdout.write('\x1B[1A')
    process.stdout.write('\x1B[2K')
    notSpecifiedFilepaths.push(filepath)
  }

  intro(`Found ${notSpecifiedFilepaths.length} directories not specified environment, Please select environment.`)

  for (const filepath of notSpecifiedFilepaths) {
    const dirpath = path.dirname(filepath)

    const spinner = createSpinner()

    spinner.start(' Loading dotenv environment...')

    const { stdout } = await spawn('npx dotenv-vault keys', { cwd: dirpath })

    spinner.stop()

    const dotenvKeys = stdout.split('\n')
      .filter(row => row.includes('dotenv://'))
      .map((row) => {
        const [env, key] = row.split('dotenv://').map(part => part.trim())
        return { env, key: `dotenv://${key}` }
      })
    const value = await select({
      message: filepath.replace(/\\\\/g, '/'),
      options: [
        // {
        //   value: 'all',
        //   label: 'all',
        //   hint: 'Ask every time the script runs',
        // },
        ...dotenvKeys.map(key => ({
          value: key.env,
          label: key.env,
        })),
      ],
    })

    if (isCancel(value)) {
      outro('Operation cancelled')
      process.exit(0)
    }

    if (value === 'all') {
      const content = [
        `#/!!!!!!!!!!!!!!!!!! .env.keys !!!!!!!!!!!!!!!!!!!!!/`,
        `#/   DOTENV_KEYs. DO NOT commit to source control   /`,
        `#/   [how it works](https://dotenv.org/env-keys)    /`,
        `#/--------------------------------------------------/`,
        ``,
        ...dotenvKeys.map(key => `DOTENV_KEY_${key.env.toUpperCase()}="${key.key}"`),
      ]
      fs.writeFileSync(path.join(dirpath, '.env.keys'), content.join('\n'))
    }
    else {
      const dotenvKey = dotenvKeys.find(({ env }) => env === value)!
      const content = [
        `#/!!!!!!!!!!!!!!!!!!! .env.key !!!!!!!!!!!!!!!!!!!!!/`,
        `#/    DOTENV_KEY. DO NOT commit to source control   /`,
        `#/    [how it works](https://dotenv.org/env-keys)   /`,
        `#/--------------------------------------------------/`,
        ``,
        `DOTENV_KEY="${dotenvKey.key}"`,
      ]
      fs.writeFileSync(path.join(dirpath, '.env.key'), content.join('\n'))
    }
  }
}

export async function readEnvironment(): Promise<void> {
  context.files = uniq(context.entries).filter(Boolean).map(entryToFile)
  for (const file of context.files) {
    const [env, scope] = file.split(':')
    const files = readfiles(process.cwd(), env, context.depth)
    if (!files.length) {
      const failedMessage = `Failed to loading ${env} file not found in all scopes`
      !['.env', '.env.local'].includes(env) && console.log(failedMessage)
      continue
    }
    context.sources.push({ env, files, scope })
  }
}

export async function loadEnvironment(): Promise<void> {
  for (const { env, files, scope } of context.sources) {
    let exist = false

    for (const filepath of files) {
      const output = parse(env, filepath, scope)
      if (!output?.parsed)
        continue
      exist = true
      Object.assign(context.parsed, output.parsed)
    }

    if (!exist)
      console.log(`Failed to loading ${env} file not found in all scopes`)
  }
}

export function mergeParseEnvironment(): void {
  context.env && Object.assign(context.parsed, context.env)

  for (const key in context.parsed)
    context.parsed[key] = replaceLiteralQuantity(context.parsed[key], context.parsed)
}

export function parse(env: string, filepath: string, scope?: string): DotenvConfigOutput | undefined {
  if (!env.startsWith('.env.vault'))
    return config({ path: filepath })

  const DOTENV_KEY = dokey(path.dirname(filepath), scope)
    || (scope
      ? process.env[`DOTENV_KEY_${scope.toUpperCase()}`]
      : process.env.DOTENV_KEY)

  if (!DOTENV_KEY)
    throw new Error('No DOTENV_KEY found in .env, .env.key or process.env')

  delete process.env.DOTENV_KEY

  return config({ DOTENV_KEY, path: filepath })
}

export function dokey(root: string, scope?: string): string | undefined {
  const target = readfile(root, scope ? `.env.keys` : '.env.key')
  if (!target)
    return undefined

  const dirname = path.dirname(target)
  if (root !== dirname && fs.existsSync(path.join(dirname, '.env.vault')))
    return

  const parsed = config({ processEnv: {}, DOTENV_KEY: undefined, path: target }).parsed
  const value = scope ? parsed?.[`DOTENV_KEY_${scope.toUpperCase()}`] : parsed?.DOTENV_KEY

  return value
}
