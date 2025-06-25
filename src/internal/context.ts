import type { Script, UserConfig } from '../types'

export const context = {
  entries: [] as string[],
  env: {} as Record<string, string>,
  before: {} as Record<string, string>,
  after: {} as Record<string, string>,
  run: [] as string | string[],
  parsed: {} as Record<string, string>,
  parsedFiles: [] as string[],

  write: false,
  depth: false,

  script: undefined as Script | undefined,

  userConfig: {} as UserConfig,

  files: [] as string[],

  sources: [] as {
    env: string
    files: string[]
    scope: string | undefined
  }[],
}
