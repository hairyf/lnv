/* eslint-disable no-console */

import type { LoadEnvironmentOptions } from './types'
import process from 'node:process'
import { authEnvironment, context, executionScript, loadEnvironment, mergeParseEnvironment, parseUserConfig, readEnvironment } from './internal'
import { run } from './run'
import { write, writeDts } from './write'

export async function lnv(options: LoadEnvironmentOptions): Promise<void> {
  // Initialize context with options
  Object.assign(context, options)

  await parseUserConfig()

  context.entries.push('env')
  context.entries.unshift('local')

  await readEnvironment()

  await authEnvironment()

  await loadEnvironment()

  await executionScript()

  Object.assign(context.parsed, context.before)

  Object.assign(context.parsed, context.env)
  Object.assign(context.parsed, context.after)

  mergeParseEnvironment()

  if (context.dts) {
    const filepath = context.dts === true ? 'process-env.d.ts' : context.dts
    writeDts(filepath, context.parsed)
  }

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
  const notFoundParsed = !Object.keys(context.parsed).length
  const notFoundManual = !Object.keys(context.env || {}).length
  const notFoundFiles = !context.parsedFiles.length

  if (notFoundParsed && notFoundFiles && notFoundManual) {
    console.log('No environment variables found')
    return ''
  }

  let message = ''
  if (notFoundFiles && !notFoundManual) {
    message = context.run
      ? `Successfully loaded ${context.parsedFiles.join(',')} to runtime environment`
      : `Successfully loaded ${context.parsedFiles.join(',')} to .env`
  }
  else if (!notFoundFiles) {
    message = context.run
      ? `Successfully loaded ${context.parsedFiles.join(',')} to runtime environment`
      : `Successfully wrote ${context.parsedFiles.join(',')} to .env`
  }
  if (!notFoundFiles && !notFoundManual)
    message += ' and with variables:'
  else if (!notFoundManual)
    message = 'Successfully manual loaded environment variables'

  if (context.env) {
    for (const [key, value] of Object.entries(context.env))
      typeof value !== 'undefined' && (message += `\n  ${key}=${value}`)
  }

  return message
}
