export function extractSingleQuotes(argv: string[]): string[] {
  const parsed: string[] = []
  let currentString = ''
  let inQuotes = false
  let quoteChar = ''
  for (const arg of argv) {
    if (arg.startsWith('\'') || arg.startsWith('`')) {
      if (inQuotes) {
        currentString += ` ${arg.slice(1)}`
      }
      else {
        inQuotes = true
        quoteChar = arg[0]
        currentString += arg.slice(1)
      }
    }
    else if (arg.endsWith('\'') || arg.endsWith('`')) {
      if (inQuotes && quoteChar === arg[arg.length - 1]) {
        currentString += ` ${arg.slice(0, -1)}`
        parsed.push(currentString.trim())
        currentString = ''
        inQuotes = false
      }
      else {
        parsed.push(arg)
      }
    }
    else {
      inQuotes ? currentString += ` ${arg}` : parsed.push(arg)
    }
  }

  currentString && parsed.push(currentString.trim())

  return parsed
}

export function extractTailCommands(argv: string[]): string[] {
  const news: string[] = []
  const runs = []
  let is = false

  for (const arg of argv) {
    if (is && (arg === ';')) {
      news.push(runs.join(' '))
      is = false
      continue
    }
    is ? runs.push(arg) : news.push(arg)
    if (arg === '-c' || arg === '--cmd')
      is = true
    if (arg === '--') {
      news.splice(news.length - 1, 1, '-c')
      is = true
    }
  }

  is && runs.length && news.push(runs.join(' '))

  return news
}
