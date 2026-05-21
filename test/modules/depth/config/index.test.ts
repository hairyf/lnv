import fs from 'node:fs/promises'
import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('depth option for lnv.config', () => {
  it('loaded lnv.config environment', async () => {
    const { stdout } = await spawn(
      'lnv',
      ['-r', 'node', '-e', 'console.log(process.env.TEST_ENV_VAR)'],
      { cwd: __dirname },
    )
    expect(stdout).toContain('test_value')

    const stats = await fs.stat(`${__dirname}/process-env.d.ts`)
    expect(stats.isFile()).toBe(true)

    const content = await fs.readFile(`${__dirname}/process-env.d.ts`, 'utf-8')
    expect(content).toContain('TEST_ENV_VAR?: string')
    expect(content).not.toContain('PATH?: string')
  })
})
