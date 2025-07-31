import type { Argv } from 'yargs'

export interface ArgvParsed {
  _?: string[]
  $0: string
  value?: string[]
  entry?: string[]
  write?: boolean
  depth?: boolean
  run?: string
}

export async function registerVltCommand(cli: Argv): Promise<void> {
  const _args = cli.usage('vlt command [args]')
    .command('pull [value]', 'Pull vault secrets')
    .help()
    .parse() as ArgvParsed
}
