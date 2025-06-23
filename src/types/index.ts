import type { Option, SelectOptions } from '@clack/prompts'

export interface Prompt {
  key: string
  message?: string
  options: (() => Promise<Option<string>[]>) | Option<string>[]
}

export interface Environment {
  [key: string]: string
}

export interface EnvironmentOptions {
  entries?: string[]
  before?: Environment
  after?: Environment
  depth?: boolean
}

export interface Command extends EnvironmentOptions {
  message?: string
  prompts?: Prompt[]
  command: string
}

export interface SelectCommand extends Omit<SelectOptions<string>, 'message'>, EnvironmentOptions {
  message?: string
  prompts?: Prompt[]
}

export type Script = Command | SelectCommand | string

export interface UserConfig {
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
