import fs from 'node:fs'
import path from 'node:path'

export function uniq<T>(array: T[]): T[] {
  return [...new Set([...array])]
}

export function entryToFile(mod?: string): string {
  if (mod === 'env')
    return `.env`
  return `.env.${mod}`
}

export function parseCommandString(command: string): string[] {
  if (typeof command !== 'string') {
    throw new TypeError(`The command must be a string: ${String(command)}.`)
  }

  const trimmedCommand = command.trim()
  if (trimmedCommand === '') {
    return []
  }

  const tokens: string[] = []
  for (const token of trimmedCommand.split(/ +/g)) {
    // Allow spaces to be escaped by a backslash if not meant as a delimiter
    const previousToken = tokens.at(-1)
    if (previousToken && previousToken.endsWith('\\')) {
      // Merge previous token with current one
      tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`
    }
    else {
      tokens.push(token)
    }
  }

  return tokens
}

export function replaceLiteralQuantity(input: string, parsed: any): string {
  return input.replace(/\$(\w+)/g, (_, key) => key in parsed ? parsed[key] : `$${key}`)
}

export function readfiles(root: string, file: string, depth = false): string[] {
  let currentDir = root
  const files: string[] = []

  while (currentDir !== path.parse(currentDir).root) {
    const envPath = path.join(currentDir, file)
    if (fs.existsSync(envPath)) {
      files.push(envPath)
      if (!depth)
        return files
    }
    currentDir = path.dirname(currentDir)
  }

  return files
}
