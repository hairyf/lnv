import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('option for vault', () => {
  it('manual loaded environment', async () => {
    const { stdout } = await spawn(
      'lnv',
      ['vault', '-o', '-c', 'node', '-e', 'console.log(process.env.HELLO)'],
      { cwd: __dirname },
    )
    expect(stdout).toContain('development')
  })
})
