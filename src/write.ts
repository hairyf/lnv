import fs from 'node:fs'

export function write(filepath: string, parsed = {}): void {
  const contents = Object.entries(parsed)
    .map(([key, value]) => `${key}=${value}`)
  const content = [
    '# This file is generated by lnv command',
    '# DO NOT ATTEMPT TO EDIT THIS FILE',
    contents.join('\n'),
  ].join('\n')
  fs.writeFileSync(filepath, content, 'utf-8')
}
