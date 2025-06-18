import type { Option, SelectOptions } from '@clack/prompts'

export interface Prompt {
  key: string
  message?: string
  options: (() => Promise<Option<string>[]>) | Option<string>[]
}

export interface ScriptCommand {
  message?: string
  prompts?: Prompt[]
  command: string
}

export interface ScriptSelectCommand extends Omit<SelectOptions<string>, 'message'> {
  message?: string
  prompts?: Prompt[]
}

export type Script = ScriptCommand | ScriptSelectCommand

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
