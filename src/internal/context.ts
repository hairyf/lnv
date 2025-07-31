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

  scope: undefined as string | undefined,

  sources: [] as {
    env: string
    files: { path: string, scope?: string }[]
  }[],
}
