import type { Options, Result } from 'nano-spawn'
import spawn from 'nano-spawn'
import { resolveImportBin } from './resolve'

export type Command =
  | 'whoami'
  | 'logout'
  | 'status'
  | 'help'
  | 'build'
  | 'login'
  | 'rotatekey'
  | 'versions'
  | 'keys'
  | 'open'

export async function vault(command: Command, args: any[], options?: Options): Promise<Result>
export async function vault(command: Command, options?: Options): Promise<Result>
export async function vault(command: Command, ...args: any[]): Promise<Result> {
  const bin = await resolveImportBin('dotenv-vault')
  let options: Options | undefined = args[1]
  let _args: any[] = []

  if (typeof args[0] === 'object') {
    options = args[0]
  }

  else if (Array.isArray(args[0])) {
    _args = args[0]
  }

  return spawn('node', [bin, command, ..._args.filter(Boolean)], options)
}
