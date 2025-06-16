export function uniq<T>(array: T[]): T[] {
  return [...new Set([...array])]
}

export function entryToFile(mod?: string | boolean): string {
  return mod !== 'env'
    ? mod === 'dotenv' ? 'env.vault' : `env.${mod}`
    : mod
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
