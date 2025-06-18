import type { Option, SelectOptions } from '@clack/prompts'

export interface Prompt {
  key: string
  message?: string
  options: (() => Promise<Option<string>[]>) | Option<string>[]
}

export interface Script {
  message?: string
  prompts?: Prompt[]
  command: string | SelectOptions<string>
}

export interface UserConfig {
  injects?: {
    entries?: string[]
    before?: { [key: string]: string }
    after?: { [key: string]: string }
  }
  scripts?: { [command: string]: Script | string }
}

export function defineConfig(config: UserConfig): UserConfig {
  return config
}
