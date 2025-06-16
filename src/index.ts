/* eslint-disable no-console */
import type { LoadEnvironmentOptions } from './types'
import process from 'node:process'
import { cmd, load, m2fi, replaceLiteralQuantity, uniq, write } from './utils'

export async function lnv(options: LoadEnvironmentOptions): Promise<void> {
  if (options.cmd && options.exp)
    throw new Error('Missing required --expose|-e or cmd options')

  const entry = [
    options.default && 'env',
    ...(options.entry || []),
    options.default && 'local',
  ]

  const files = uniq(entry).filter(Boolean).map(m2fi)
  const parsed: Record<string, string> = {}
  const parsedFiles: string[] = []

  for (const file of files) {
    const envs = load(file, options)
    if (!envs)
      continue
    Object.assign(parsed, envs)
    parsedFiles.unshift(file)
  }

  options.values && Object.assign(parsed, options.values)

  const foundParsed = !Object.keys(parsed).length
  const foundManual = !Object.keys(options.values || {}).length
  const foundFiles = !parsedFiles.length

  if (foundParsed && foundFiles && foundManual)
    console.log('No environment variables found')

  let message = ''
  if (foundFiles && !foundManual) {
    message = options.cmd
      ? `Successfully loaded ${parsedFiles.join('|')} to runtime environment`
      : `Successfully loaded ${parsedFiles.join('|')} to .env`
  }
  else if (!foundFiles) {
    message = options.cmd
      ? `Successfully loaded ${parsedFiles.join('|')} to runtime environment`
      : `Successfully exposed ${parsedFiles.join('|')} to .env`
  }
  if (!foundFiles && !foundManual)
    message += ' and with variables:'
  else if (!foundManual)
    message = 'Successfully manual loaded environment variables'

  if (options.values) {
    for (const [key, value] of Object.entries(options.values))
      typeof value !== 'undefined' && (message += `\n  ${key}=${value}`)
  }

  for (const key in parsed)
    parsed[key] = replaceLiteralQuantity(parsed[key], parsed)

  if (options.cmd) {
    message && console.log(message)
    console.log()
    await cmd(options.cmd, parsed)
  }

  if (options.exp) {
    write(`${process.cwd()}/.env`, parsed)
    console.log()
    message && console.log(message)
  }
}
