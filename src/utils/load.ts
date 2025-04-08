/* eslint-disable no-console */
import type { DotenvConfigOutput } from 'dotenv'
import type { LoadEnvironmentOptions } from '../types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

const root = process.cwd()

export function load(mode: string, options: LoadEnvironmentOptions = {}): Record<string, string> | undefined {
  const [name, env] = mode.split(':')
  const file = `.${name}`
  const filepaths = find(file, options.deep)
  const parsed: Record<string, string> = {}
  let exist = false
  for (const filepath of filepaths) {
    const envs = loadFile(filepath, file, env)
    if (!envs)
      continue
    exist = true
    envs && Object.assign(parsed, envs.parsed)
  }

  if (exist)
    return parsed
  if (options.default && ['env', 'env.local'].includes(name))
    return
  console.log(`Failed to loading ${name} file not found in all scopes`)
}

function loadFile(filepath: string, file: string, env?: string): DotenvConfigOutput | undefined {
  if (!file.startsWith('.env.vault'))
    return expand(config({ path: filepath }))

  const DOTENV_KEY = (env
    ? dokey('.env.keys', env)
    : dokey('.env.key')) || (env
    ? process.env[`DOTENV_KEY_${env.toUpperCase()}`]
    : process.env.DOTENV_KEY)

  if (!DOTENV_KEY)
    throw new Error('No DOTENV_KEY found in .env|.env.key or process.env')

  return expand(config({ DOTENV_KEY, path: filepath }))
}

export function find(file: string, deep = false): string[] {
  let currentDir = root
  const files: string[] = []

  while (currentDir !== path.parse(currentDir).root) {
    const envPath = path.join(currentDir, file)
    if (fs.existsSync(envPath)) {
      files.push(envPath)
      if (!deep)
        return files
    }
    currentDir = path.dirname(currentDir)
  }

  return files
}

export function dokey(file: string, environment?: string): string | undefined {
  const parsed = expand(config({ processEnv: {}, DOTENV_KEY: undefined, path: find(file) })).parsed
  return environment ? parsed?.[`DOTENV_KEY_${environment.toUpperCase()}`] : parsed?.DOTENV_KEY
}
