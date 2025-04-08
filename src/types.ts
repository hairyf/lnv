export interface LoadEnvironmentOptions {
  /**
   * set environment variables entry
   *
   * @example
   * // load .env, .env.local
   * entry: ['env', 'local']
   */
  entry?: string[]
  /**
   * the default environment (env|...|env.local) be loaded
   */
  default?: boolean
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
  values?: Record<string, string>

  /**
   * set environment variables to .env file
   */
  exp?: boolean
  /**
   * command to run
   */
  cmd?: string | string[]

  /**
   * deep load and merge environment variables
   */
  deep?: boolean
}
