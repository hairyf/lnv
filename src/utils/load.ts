import type { DotenvConfigOutput } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

const root = process.cwd()

export function load(file: string): DotenvConfigOutput | undefined {
  file = `.${file}`
  const filepath = find(file)

  if (!filepath)
    return undefined

  if (file !== '.env.vault')
    return expand(config({ path: filepath }))

  const DOTENV_KEY = dokey('.env.key') || process.env.DOTENV_KEY || dokey('.env')

  if (!DOTENV_KEY)
    throw new Error('No DOTENV_KEY found in .env|.env.key or process.env')

  return expand(config({ DOTENV_KEY, path: filepath }))
}

export function find(file: string): string | undefined {
  let currentDir = root

  while (currentDir !== path.parse(currentDir).root) {
    const envPath = path.join(currentDir, file)
    if (fs.existsSync(envPath)) {
      return envPath
    }
    currentDir = path.dirname(currentDir)
  }

  return undefined
}

export function dokey(file: string, environment?: string): string | undefined {
  const parsed = expand(config({ processEnv: {}, DOTENV_KEY: undefined, path: find(file) })).parsed
  return environment ? parsed?.[`DOTENV_KEY_${environment.toUpperCase()}`] : parsed?.DOTENV_KEY
}
