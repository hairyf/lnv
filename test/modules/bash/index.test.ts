import path from 'node:path'
import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('option for value', () => {
  it('manual loaded environment', async () => {
    const { stdout } = await spawn('lnv', [
      '-v',
      'TEST_VAR=123',
      '-r',
      path.join(__dirname, 'index.sh'),
    ])
    expect(stdout).toContain('TEST_VAR:123')
  })
})
