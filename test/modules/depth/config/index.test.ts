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
  })
})
