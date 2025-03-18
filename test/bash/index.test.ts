import path from 'node:path'
import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'

describe('option for value', () => {
  it('manual loaded environment', async () => {
    const { stdout } = await x('lnv', [
      '-v',
      'TEST_VAR=123',
      '-c',
      path.join(__dirname, 'index.sh'),
    ])
    expect(stdout).toContain('TEST_VAR:123')
  })
})
