import type { Option, SelectOptions } from '@clack/prompts'

export interface Prompt {
  key: string
  message?: string
  options: (() => Promise<Option<string>[]>) | Option<string>[]
}

export interface EnvironmentOptions {
  depth?: boolean
  env?: Record<string, string>
  entries?: string[]
  before?: { [key: string]: string }
  after?: { [key: string]: string }
}

export interface ScriptCommand {
  message?: string
  prompts?: Prompt[]
  command: string
  depth?: boolean
  env?: Record<string, string>
}

export interface ScriptSelectCommand extends Omit<SelectOptions<string>, 'message'> {
  message?: string
  prompts?: Prompt[]
  depth?: boolean
  env?: Record<string, string>
}

export type Script = (ScriptCommand | ScriptSelectCommand)

export interface UserConfig {
  injects?: EnvironmentOptions
  scripts?: { [command: string]: Script | string }
}

export function defineConfig(config: UserConfig): UserConfig {
  return config
}
