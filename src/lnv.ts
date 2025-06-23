/* eslint-disable no-console */

import type { LoadEnvironmentOptions } from './types'
import process from 'node:process'
import { context, executionScript, loadEnvironment, parseUserConfig } from './internal'
import { run } from './run'
import { entryToFile, replaceLiteralQuantity, uniq } from './utils'
import { write } from './write'

export async function lnv(options: LoadEnvironmentOptions): Promise<void> {
  // Initialize context with options
  Object.assign(context, options)

  await parseUserConfig()

  context.entries.push('env')
  context.entries.unshift('local')

  await executionScript()

  context.files = uniq(context.entries).filter(Boolean).map(entryToFile)
  Object.assign(context.parsed, context.before)

  // console.log(context.files)
  // TODO: Automatic vault authentication authorization

  await loadEnvironment()

  context.env && Object.assign(context.parsed, context.env)

  for (const key in context.parsed)
    context.parsed[key] = replaceLiteralQuantity(context.parsed[key], context.parsed)

  const message = assembleMessage()

  if (context.run) {
    message && console.log(message)
    console.log()
    await run(context.run, context.parsed)
  }

  if (context.write) {
    write(`${process.cwd()}/.env`, context.parsed)
    console.log()
    message && console.log(message)
  }
}

function assembleMessage(
): string {
  const foundParsed = !Object.keys(context.parsed).length
  const foundManual = !Object.keys(context.env || {}).length
  const foundFiles = !context.parsedFiles.length

  if (foundParsed && foundFiles && foundManual)
    console.log('No environment variables found')

  let message = ''
  if (foundFiles && !foundManual) {
    message = context.run
      ? `Successfully loaded ${context.parsedFiles.join(',')} to runtime environment`
      : `Successfully loaded ${context.parsedFiles.join(',')} to .env`
  }
  else if (!foundFiles) {
    message = context.run
      ? `Successfully loaded ${context.parsedFiles.join(',')} to runtime environment`
      : `Successfully wrote ${context.parsedFiles.join(',')} to .env`
  }
  if (!foundFiles && !foundManual)
    message += ' and with variables:'
  else if (!foundManual)
    message = 'Successfully manual loaded environment variables'

  if (context.env) {
    for (const [key, value] of Object.entries(context.env))
      typeof value !== 'undefined' && (message += `\n  ${key}=${value}`)
  }

  return message
}
