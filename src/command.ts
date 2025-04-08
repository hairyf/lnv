import type { Argv } from 'yargs'
import { lnv } from '.'

export interface ArgvParsed {
  _?: string[]
  $0: string
  value?: string[]
  entry?: string[]
  default?: boolean
  vault?: string
  expose?: boolean
  cmd?: string
  overflow?: boolean
}

export async function registerCommand(cli: Argv): Promise<void> {
  const args = cli.usage('lnv <entry> [args]')
    .alias('h', 'help')
    .option('value', {
      describe: 'set environment variables',
      type: 'array',
      alias: 'v',
    })
    .option('overflow', {
      describe: 'deep find and merge environment variables',
      type: 'boolean',
      alias: 'o',
    })
    .option('entry', {
      describe: 'Manual selection entry',
      type: 'array',
      alias: 'e',
    })
    .option('vault', {
      describe: 'load environment variables from vault',
      type: 'string',
      alias: 'vlt',
    })
    .option('cmd', {
      describe: 'load runtime environment and run any scripts',
      type: 'string',
      alias: 'c',
    })
    .option('expose', {
      describe: 'expose environment variables',
      type: 'boolean',
    })
    .option('default', {
      describe: 'the default environment (env|...|env.local) be loaded',
      alias: 'd',
      type: 'boolean',
    })
    .help()
    .parse() as ArgvParsed

  const entry = [...(args._ || []), ...(args.entry || [])]

  if (typeof args.vault !== 'undefined') {
    args.vault !== ''
      ? entry.unshift(`vault:${args.vault}`)
      : entry.unshift('vault')
  }

  const values = args.value?.reduce(
    (acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  await lnv({
    default: args.default,
    exp: args.expose,
    cmd: args.cmd,
    deep: args.overflow,
    entry,
    values,
  })
}
