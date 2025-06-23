export function uniq<T>(array: T[]): T[] {
  return [...new Set([...array])]
}

export function entryToFile(mod?: string): string {
  if (mod === 'env')
    return `.env`
  return `.env.${mod}`
}

export function replaceLiteralQuantity(input: string, parsed: any): string {
  return input.replace(/\$(\w+)/g, (_, key) => key in parsed ? parsed[key] : `$${key}`)
}
