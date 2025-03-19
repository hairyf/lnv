import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('option for vault keys', () => {
  it('loaded vault ci environment', async () => {
    const { stdout } = await spawn(
      'lnv',
      ['vault:ci', '-c', 'node', '-e', 'console.log(process.env.HELLO)'],
      { cwd: __dirname },
    )
    expect(stdout).toContain('ci')
  })
})
