import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { version } from '../../package.json'
import { registerLnvCommand } from './lnv'
import { extractSingleQuotes, extractTailCommands } from './utils'

const argv = extractTailCommands(extractSingleQuotes(hideBin(process.argv)))

const cli = yargs(argv)
  .scriptName('lnv')
  .showHelpOnFail(false)
  .version(version)

export async function run(): Promise<void> {
  await registerLnvCommand(cli)
}
