export function uniq<T>(array: T[]): T[] {
  return [...new Set([...array])]
}

export function entryToFile(mod?: string): string {
  if (mod === 'env')
    return `.env`
  return `.env.${mod}`
}
