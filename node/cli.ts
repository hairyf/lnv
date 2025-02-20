import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { version } from '../package.json'
import { quotes } from './utils'

export function createYargsArgv() {
  return yargs(quotes(hideBin(process.argv)))
    .scriptName('lnv')
    .showHelpOnFail(false)
    .version(version)
    .usage('lnv <mode> [args]')
    .alias('h', 'help')
    .alias('v', 'version')
    .option('run', {
      describe: 'load runtime environment and run any scripts',
      type: 'array',
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
    .option('default', {
      describe: 'the default environment (env|...|env.local) be loaded',
      alias: 'd',
      type: 'boolean',
    })
    .help()
}