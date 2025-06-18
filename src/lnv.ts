/* eslint-disable ts/explicit-function-return-type */
/* eslint-disable no-console */

import type { Prompt, Script, ScriptCommand, ScriptSelectCommand, UserConfig } from './config'
import type { LoadEnvironmentOptions } from './types'
import process from 'node:process'
import { intro, isCancel, outro, select } from '@clack/prompts'
import { loadConfig } from 'unconfig'
import { load } from './load'
import { run } from './run'
import { entryToFile, replaceLiteralQuantity, uniq } from './utils'
import { write } from './write'

export async function lnv(options: LoadEnvironmentOptions): Promise<void> {
  const { config = {} } = await loadConfig<UserConfig>({
    sources: [{ files: 'lnv.config' }],
    cwd: process.cwd(),
    merge: true,
  })

  const scriptName = options.entry?.[0] as string
  const script = config.scripts?.[scriptName] as Script | string | undefined
  const entry = script ? [] : (options.entry || [])

  if (config.injects?.entries)
    entry.unshift(...config.injects.entries)
  if (config.injects?.depth)
    options.depth = config.injects.depth
  if (config.injects?.env)
    options.env = Object.assign(options.env || {}, config.injects.env)

  if (options.default) {
    entry.push('env')
    entry.unshift('local')
  }

  const files = uniq(entry).filter(Boolean).map(entryToFile)
  const parsed: Record<string, string> = config.injects?.before || {}
  const parsedFiles: string[] = []

  for (const file of files) {
    const envs = load(file, options)
    if (!envs)
      continue
    Object.assign(parsed, envs)
    parsedFiles.unshift(file)
  }

  options.env && Object.assign(parsed, options.env)
  config.injects?.after && Object.assign(parsed, config.injects.after)

  if (script) {
    const parsedScript = await assembleScript(script)
    parsedScript.env && Object.assign(parsed, parsedScript.env)
    Object.assign(parsed, parsedScript.parsed)
    options.run = parsedScript.run
    if (parsedScript.depth)
      options.depth = parsedScript.depth
  }

  for (const key in parsed)
    parsed[key] = replaceLiteralQuantity(parsed[key], parsed)

  const message = assembleMessage(parsedFiles, parsed, options)

  if (options.run) {
    message && console.log(message)
    console.log()
    await run(options.run, parsed)
  }

  if (options.write) {
    write(`${process.cwd()}/.env`, parsed)
    console.log()
    message && console.log(message)
  }
}

async function assembleScript(script: Script | string) {
  if (typeof script === 'string') {
    return { run: script, parsed: {} }
  }
  const {
    prompts = [],
    command: run,
    message,
    depth,
    env,
    ...selectOptions
  } = script as ScriptCommand & ScriptSelectCommand

  const isSelectCommand = selectOptions.options.length && !run
  if (isSelectCommand) {
    const value = await select({
      message: message || 'Please select a command',
      ...selectOptions,
    })
    if (isCancel(value)) {
      outro('Operation cancelled')
      process.exit(0)
    }
    return { run: value, parsed: {}, depth, env }
  }
  else {
    intro(message)
    const parsed = await collectPrompts(prompts)
    return { run, parsed, depth, env }
  }
}

async function collectPrompts(prompts: Prompt[]): Promise<Record<string, string>> {
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
  return parsed
}

function assembleMessage(
  parsedFiles: string[],
  parsed: Record<string, string>,
  options: LoadEnvironmentOptions,
): string {
  const foundParsed = !Object.keys(parsed).length
  const foundManual = !Object.keys(options.env || {}).length
  const foundFiles = !parsedFiles.length

  if (foundParsed && foundFiles && foundManual)
    console.log('No environment variables found')

  let message = ''
  if (foundFiles && !foundManual) {
    message = options.run
      ? `Successfully loaded ${parsedFiles.join('|')} to runtime environment`
      : `Successfully loaded ${parsedFiles.join('|')} to .env`
  }
  else if (!foundFiles) {
    message = options.run
      ? `Successfully loaded ${parsedFiles.join('|')} to runtime environment`
      : `Successfully wrote ${parsedFiles.join('|')} to .env`
  }
  if (!foundFiles && !foundManual)
    message += ' and with variables:'
  else if (!foundManual)
    message = 'Successfully manual loaded environment variables'

  if (options.env) {
    for (const [key, value] of Object.entries(options.env))
      typeof value !== 'undefined' && (message += `\n  ${key}=${value}`)
  }

  return message
}
