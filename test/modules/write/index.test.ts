import fs from 'node:fs/promises'
import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('option for expose', () => {
  it('expose env', async () => {
    await spawn(
      'lnv',
      ['-d', '-v', 'TEST_VAR=123', '-e'],
      { cwd: __dirname },
    )

    const stats = await fs.stat(`${__dirname}/.env`)
    expect(stats.isFile()).toBe(true)

    const content = await fs.readFile(`${__dirname}/.env`, 'utf-8')
    expect(content).toContain('TEST_VAR=123')
  })
})
