import { join } from 'node:path'
import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('deep directory', () => {
  it('loaded environment', async () => {
    const { stdout } = await spawn(
      'lnv',
      ['-d', '-o', '-c', join(__dirname, 'index.sh')],
      { cwd: __dirname },
    )
    expect(stdout).toContain('TEST_VARS:1 2')
  })
})
