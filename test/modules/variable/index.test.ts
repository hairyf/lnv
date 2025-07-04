import path from 'node:path'
import spawn from 'nano-spawn'
import { describe, expect, it } from 'vitest'

describe('environment variable replacement', () => {
  it('replaces $ENV_VAR with its value', async () => {
    const { stdout } = await spawn('lnv', [
      '-v',
      'VAR=321',
      '-v',
      'TEST_VAR=$VAR',
      '-r',
      'node',
      path.join(__dirname, 'index.js'),
    ])
    expect(stdout).toContain('TEST_VAR:321')

    const { stdout: stdout2 } = await spawn('lnv', [
      '-v',
      'VAR=321',
      '-v',
      'TEST_VAR=$VAR',
      '-r',
      'echo TEST_VAR_$TEST_VAR',
    ])
    expect(stdout2).toContain('TEST_VAR_321')
  })
})
