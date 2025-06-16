import type { Options } from 'nano-spawn'
import process from 'node:process'
import spawn from 'nano-spawn'
import { parseCommandString, replaceLiteralQuantity } from './util'

export async function cmd(command: string | string[], env?: Record<string, string>): Promise<void> {
  if (Array.isArray(command))
    command = command.join(' ')
  if (!command)
    throw new Error('Unable to run empty running script')

  const mergedEnv = { ...process.env, ...env } as Record<string, string>

  const options: Options = {
    env: mergedEnv,
    stdio: 'inherit',
    stderr: 'inherit',
    stdin: 'inherit',
    stdout: 'inherit',
  }
  const commands = command.split('&&').map(cmd => cmd.trim())
  for (let command of commands) {
    command = replaceLiteralQuantity(command, mergedEnv)

    if (command.includes('.sh') && !command.startsWith('sh ')) {
      command = `sh ${command}`
    }
    const [cmd, ...args] = parseCommandString(command)
    spawn(cmd, args, options)
  }
}
