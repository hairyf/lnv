import path from "pathe"
import fs from "fs"
import { config } from 'dotenv'
import { getPackages } from '@manypkg/get-packages';
const root = process.cwd()

export function setup<T>(root = '', hook: () => T) {
  const source = process.cwd
  if (root)
    process.cwd = () => root
  const result = hook()
  process.cwd = source
  return result
}
export function dokey(file: string) {
  const filepath = find(file)
  const root = filepath ? path.dirname(filepath) : undefined
  const envs = config({ processEnv: {}, path: filepath })
  const DOTENV_KEY = envs.parsed?.DOTENV_KEY || process.env.DOTENV_KEY
  return { root, filepath, DOTENV_KEY }
}

export function find(file: string) {
  let currentDir = root;

  while (currentDir !== path.parse(currentDir).root) {
    const envPath = path.join(currentDir, file);
    if (fs.existsSync(envPath)) {
      return envPath;
    }
    currentDir = path.dirname(currentDir);
  }

  return undefined;
}

export function write(filepath: string, parsed = {}) {
  const contents = Object.entries(parsed)
    .map(([key, value]) => `${key}=${value}`)
  const content = [
    "# This file is generated by lnv command",
    '# DO NOT ATTEMPT TO EDIT THIS FILE',
    contents.join('\n'),
  ].join('\n')
  fs.writeFileSync(filepath, content, 'utf-8')
}

export async function exposes(parsed: Record<string, string> = {}) {
  const { packages } = await getPackages(process.cwd())
  for (const pack of packages) {
    console.log(` - ${path.relative(root, pack.dir)}/.env`)
    write(`${pack.dir}/.env`, parsed)
  }
}

export async function expose(parsed: Record<string, string> = {}) {
  write(`${root}/.env`, parsed)
}