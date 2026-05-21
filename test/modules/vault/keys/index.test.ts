import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('option for vault keys', () => {
  it.skip('loaded vault ci environment', async () => {
    const hasDotenvKeyCi = Boolean(
      process.env.GITHUB_ACTIONS
      && (process.env.DOTENV_KEY_CI || fs.existsSync(path.join(__dirname, '.env.keys'))),
    )
    if (!hasDotenvKeyCi)
      return

    const { stdout } = await spawn(
      'lnv',
      ['vault:ci', '-r', 'node', '-e', 'console.log(process.env.HELLO)'],
      { cwd: __dirname },
    )
    expect(stdout).toContain('ci')
  }, 60_000)
})
