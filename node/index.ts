#!/usr/bin/env node

import { dokey, expose, exposes, find, setup } from "./utils";
import { parse } from './cli'
import { config } from "dotenv";


const args = parse()

if (!args.monorepo && !args._[0])
  throw new Error(`Please enter lnv <mode> the loading mode`)

const dotenv = args._[0] === 'dotenv'
const mode = args._[0]
const file = dotenv ? '.env.vault' : mode
  ? `.env.${mode}` : '.env'
const command = args.run?.join(' ') || ''

let suffix = args.expose
  ? args.monorepo ? 'packages by' : '.env'
  : 'runtime environment'

let successfullyMessage = dotenv
  ? `Successfully decrypted ${file} to ${suffix}`
  : `Successfully loaded ${file} to ${suffix}`

command && (successfullyMessage += '\n')

async function main() {
  try {
    const envs = dotenv ? loadVault() : loadLocal()

    if (envs.error)
      return

    console.log(successfullyMessage)

    const { execa } = await import('execa');

    command && execa(command, { env: envs.parsed, stdout: 'inherit' })

    if (args.expose) {
      args.monorepo
        ? await exposes(envs.parsed)
        : await expose(envs.parsed)
    }
  } catch (error) {

  }
}

main()

function loadLocal() {
  return config({ path: find(file) })
}

function loadVault() {
  const { DOTENV_KEY, root } = dokey('.env.key') || dokey('.env')

  if (!DOTENV_KEY)
    throw new Error('no DOTENV_KEY found in .env | .env.key or process.env')

  return config({ DOTENV_KEY, path: find('.env.vault') })
}

