import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { version } from '../package.json'
import { parseQuotes } from './utils'

export function parse(): any {
  return yargs(parseQuotes(hideBin(process.argv)))
    .scriptName('lnv')
    .showHelpOnFail(false)
    .version(version)
    .usage('$0 <mode> [args]')
    .alias('h', 'help')
    .alias('v', 'version')
    .option('run', {
      describe: 'load runtime environment and run any scripts',
      type: 'string',
      alias: 'r',
    })
    .option('monorepo', {
      describe: 'apply to packages in the monorepo.',
      type: 'boolean',
      alias: 'm',
    })
    .option('expose', {
      describe: "expose environment variables",
      alias: 'e',
      type: 'boolean'
    })
    .help()
    .parse()
}