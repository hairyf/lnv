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

let suffix = args.expose
  ? args.monorepo ? 'packages by' : '.env'
  : 'runtime environment'

let successfullyMessage = dotenv
  ? `Successfully decrypted ${file} to ${suffix}`
  : `Successfully loaded ${file} to ${suffix}`

args.run?.length && (successfullyMessage += '\n')

async function main() {
  const envs = dotenv ? loadVault() : loadLocal()

  if (envs.error)
    console.log(`Failed to load ${file}, searched upwards, but the file was not found`)
  else
    console.log(successfullyMessage)

  if (args.run) {
    const { execa } = await import('execa');
    const command = args.run?.join(' ') || ''
    try {
      await execa(command, { env: envs.parsed, stdout: 'inherit' })
    } catch (error) {
      execSync(command, { stdio: 'inherit' })
    }
  }


  if (args.expose) {
    const exposeEnv = args.monorepo ? exposes : expose
    await exposeEnv(envs.parsed)
  }
}

main()

function loadLocal() {
  return config({ path: find(file) })
}

function loadVault() {
  const DOTENV_KEY = dokey('.env.key') || process.env.DOTENV_KEY || dokey('.env')

  if (!DOTENV_KEY)
    throw new Error('no DOTENV_KEY found in .env | .env.key or process.env')

  return config({ DOTENV_KEY, path: find('.env.vault') })
}

