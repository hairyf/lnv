import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { version } from '../package.json'
import { quotes } from './utils'

export function createYargsArgv() {
  const argv = runs(quotes(hideBin(process.argv)))
  return yargs(argv)
    .scriptName('lnv')
    .showHelpOnFail(false)
    .version(version)
    .usage('lnv <mode> [args]')
    .alias('h', 'help')
    .option('value', {
      type: 'array',
      alias: 'v',
      describe: 'set environment variables',
    })
    .option('run', {
      describe: 'load runtime environment and run any scripts',
      type: 'array',
      alias: 'r',
    })
    .option('mode', {
      describe: 'Manual selection mode',
      type: 'array',
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

function runs(argv: string[]) {
  const news: string[] = []
  const runs = []
  let is = false
  
  for (const arg of argv) {
    if (is && (arg === 'e;')) {
      news.push(runs.join(' '))
      is = false
      continue
    }
    is ? runs.push(arg) : news.push(arg)
    if (arg === '-r' || arg === '--run')
      is = true
    if (arg === '-' || arg === '--') {
      news.splice(news.length - 1, 1, '-r')
      is = true
    }
  }

  is && runs.length && news.push(runs.join(' '))

  return news
}