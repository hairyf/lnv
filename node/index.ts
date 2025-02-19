#!/usr/bin/env node

import { dokey, expose, exposes, find, setup } from "./utils";
import { parse } from './cli'
import { config } from "dotenv";
import { execSync } from "child_process";


const args = parse()

if (!args.monorepo && !args._[0])
  throw new Error(`Please enter lnv <mode> the loading mode`)

const dotenv = args._[0] === 'dotenv'
const mode = args._[0]
const file = dotenv ? '.env.vault' : mode
  ? `.env.${mode}` : '.env'
const exp = args.monorepo ? exposes : expose

let suffix = args.expose
  ? args.monorepo ? 'packages by' : '.env'
  : 'runtime environment'

let successfullyMessage = dotenv
  ? `Successfully decrypted ${file} to ${suffix}`
  : `Successfully loaded ${file} to ${suffix}`

args.run?.length && (successfullyMessage += '\n')

async function main() {
  const envs = dotenv ? vaultEnv() : localEnv()

  if (envs.error)
    console.log(`Failed to load ${file}, searched upwards, but the file was not found`)
  else
    console.log(successfullyMessage)

  args.run && await cmd(args.run, envs.parsed)
  args.expose && await exp(envs.parsed)
}

main()

function localEnv() {
  return config({ path: find(file) })
}

function vaultEnv() {
  const DOTENV_KEY = dokey('.env.key') || process.env.DOTENV_KEY || dokey('.env')

  if (!DOTENV_KEY)
    throw new Error('no DOTENV_KEY found in .env | .env.key or process.env')

  return config({ DOTENV_KEY, path: find('.env.vault') })
}

async function cmd(command?: string | string[], env?: Record<string, string>) {
  if (Array.isArray(command))
    command = command.join(' ')
  const options: any = { stdio: 'inherit', env: { ...process.env, ...env } }
  try {
    const { execaSync } = await import('execa')
    execaSync(command, options)
  } catch (error) {
    execSync(command, options)
  }
}
