/* eslint-disable no-console */

import type { Script, UserConfig } from './config'
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
  })

  const scriptName = options.entry?.[0] as string
  const script = config.scripts?.[scriptName] as Script | string | undefined
  const entry = script ? [] : (options.entry || [])

  if (config.injects?.entries)
    entry.unshift(...config.injects.entries)

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

  options.values && Object.assign(parsed, options.values)
  config.injects?.after && Object.assign(parsed, config.injects.after)

  if (typeof script === 'string') {
    options.run = script
  }
  else if (typeof script === 'object') {
    const { prompts = [], command, message } = script

    message && intro(message)

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

    if (typeof command === 'object') {
      const value = await select(command)
      if (isCancel(value)) {
        outro('Operation cancelled')
        process.exit(0)
      }
      options.run = value
    }
    else {
      options.run = command
    }
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

function assembleMessage(
  parsedFiles: string[],
  parsed: Record<string, string>,
  options: LoadEnvironmentOptions,
): string {
  const foundParsed = !Object.keys(parsed).length
  const foundManual = !Object.keys(options.values || {}).length
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

  if (options.values) {
    for (const [key, value] of Object.entries(options.values))
      typeof value !== 'undefined' && (message += `\n  ${key}=${value}`)
  }

  return message
}
