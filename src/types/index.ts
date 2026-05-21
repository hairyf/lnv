import type { ConfirmOptions, MultiSelectOptions, Option, PasswordOptions, SelectOptions, TextOptions } from '@clack/prompts'

export type ParsedFn<V> = (parsed: Record<string, string>) => Promise<V> | V

export interface PromptSelect extends Omit<SelectOptions<string>, 'options' | 'message'> {
  type: 'select'
  key: string
  message?: string
  options: ParsedFn<Option<string>[]> | Option<string>[]
}

export interface PromptMultiselect extends Omit<MultiSelectOptions<string>, 'options' | 'message'> {
  type: 'multiselect'
  key: string
  message?: string
  options: ParsedFn<Option<string>[]> | Option<string>[]
}

export interface PromptConfirm extends Omit<ConfirmOptions, 'message'> {
  type: 'confirm'
  key: string
  message?: string
}

export interface PromptText extends Omit<TextOptions, 'message'> {
  type: 'text'
  key: string
  message?: string
}

export interface PromptPassword extends Omit<PasswordOptions, 'message'> {
  type: 'password'
  key: string
  message?: string
}

export interface PromptHandler {
  type: 'handler'
  key: string
  handler: ParsedFn<string>
}

export type Prompt = PromptSelect | PromptText | PromptPassword | PromptMultiselect | PromptConfirm | PromptHandler

export interface Environment {
  [key: string]: string
}

export interface EnvironmentOptions {
  entries?: string[]
  before?: Environment
  after?: Environment
  depth?: boolean
}

export interface Command extends Omit<SelectOptions<string>, 'message' | 'options'>, EnvironmentOptions {
  message?: string
  prompts?: Prompt[]
  command: string | Option<string>[]
}

export type Script = Command | string

export interface UserConfig {
  dts?: boolean | string
  injects?: EnvironmentOptions
  scripts?: { [command: string]: Script | string }
}

export interface LoadEnvironmentOptions {
  /**
   * set environment variables entry
   *
   * @example
   * // load .env, .env.local
   * entry: ['env', 'local']
   */
  entries?: string[]

  /**
   * set environment variables
   *
   * @example
   * // set environment variables
   * values: {
   *   NODE_ENV: 'production',
   *   PORT: '3000'
   * }
   */
  env?: Record<string, string>

  /**
   * set environment variables to .env file
   */
  write?: boolean

  /**
   * command to run
   */
  run?: string | string[]

  /**
   * deep load and merge environment variables
   */
  depth?: boolean
}
