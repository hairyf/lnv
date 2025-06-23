import type { Argv } from 'yargs'
import { lnv } from '..'

export interface ArgvParsed {
  _?: string[]
  $0: string
  value?: string[]
  entry?: string[]
  write?: boolean
  depth?: boolean
  run?: string
}

export async function registerMainCommand(cli: Argv): Promise<void> {
  const args = cli.usage('lnv <entry> [args]')
    .alias('h', 'help')
    .option('value', {
      describe: 'set environment variables',
      type: 'array',
      alias: 'v',
    })
    .option('depth', {
      describe: 'depth find and merge environment variables',
      type: 'boolean',
      alias: 'd',
    })
    .option('entry', {
      describe: 'Manual selection entry',
      type: 'array',
      alias: 'e',
    })
    .option('run', {
      describe: 'load runtime environment and run any scripts',
      type: 'string',
      alias: 'r',
    })
    .option('write', {
      describe: 'expose and write environment variables to .env file',
      type: 'boolean',
    })
    .help()
    .parse() as ArgvParsed

  const entries = [...(args._ || []), ...(args.entry || [])]

  const env = args.value?.reduce(
    (acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  await lnv({
    write: args.write,
    run: args.run,
    depth: args.depth,
    entries,
    env,
  })
}
