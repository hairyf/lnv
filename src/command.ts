import type { Argv } from 'yargs'
import { lnv } from '.'

export interface ArgvParsed {
  _?: string[]
  $0: string
  value?: string[]
  entry?: string[]
  default?: boolean
  exp?: boolean
  cmd?: string
}

export async function registerCommand(cli: Argv): Promise<void> {
  const args = cli.usage('lnv <entry> [args]')
    .alias('h', 'help')
    .option('value', {
      type: 'array',
      alias: 'v',
      describe: 'set environment variables',
    })
    .option('entry', {
      describe: 'Manual selection entry',
      type: 'array',
    })
    .option('cmd', {
      describe: 'load runtime environment and run any scripts',
      type: 'string',
      alias: 'c',
    })
    .option('exp', {
      describe: 'expose environment variables',
      alias: 'e',
      type: 'boolean',
    })
    .option('default', {
      describe: 'the default environment (env|...|env.local) be loaded',
      alias: 'd',
      type: 'boolean',
    })
    .help()
    .parse() as ArgvParsed

  const values = args.value?.reduce(
    (acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  await lnv({
    cmd: args.cmd,
    default: args.default,
    entry: args._,
    exp: args.exp,
    values,
  })
}
