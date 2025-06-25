/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { resolvePath, resolvePathSync } from 'mlly'
import { resolveGlobal } from 'resolve-global'

/**
 * Before is CJS: use 'resolve'
 * ESM: use 'mlly'
 *
 * @param module The name of the package to resolve
 * @param ensure Whether to ensure the package is installed
 */
export async function resolveImport(module: string, ensure?: true): Promise<string>
export async function resolveImport(module: string, ensure?: boolean): Promise<string | undefined>
export async function resolveImport(module: string, ensure = false): Promise<any> {
  try {
    return await resolvePath(module, { url: import.meta.url })
  }
  catch (error) {
    console.log(error)
  }

  try {
    return resolveGlobal(module)
  }
  catch { }

  if (ensure)
    throw new Error(`Failed to resolve package ${module}`)
  else
    console.warn(`Failed to resolve package ${module}`)
}

/**
 * Before is CJS: use 'resolve'
 * ESM: use 'mlly'
 *
 * @param module The name of the package to resolve
 * @param ensure Whether to ensure the package is installed
 */
export function resolveImportSync(module: string, ensure?: true): string
export function resolveImportSync(module: string, ensure?: false): string | undefined
export function resolveImportSync(module: string, ensure = false): string | undefined {
  try {
    return resolvePathSync(module, { url: import.meta.url })
  }
  catch (error) {
    console.log(error)
  }

  try {
    return resolveGlobal(module)
  }
  catch { }

  if (ensure)
    throw new Error(`Failed to resolve package ${module}`)
  else
    console.warn(`Failed to resolve package ${module}`)
}

/**
 * Resolve the binary path for a package
 * @param module The name of the package to resolve
 * @param bin The name of the binary to resolve
 * @param ensure Whether to ensure the package is installed
 */
export async function resolveImportBin(module: string, bin?: string, ensure?: true): Promise<string>
export async function resolveImportBin(module: string, bin?: string, ensure?: boolean): Promise<string | undefined>
export async function resolveImportBin(module: string, bin?: string, ensure = false): Promise<any> {
  const root = path.dirname(await resolveImport(`${module}/package.json`, ensure as true))
  const json = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))
  return path.join(root, bin ? json.bin[bin] : Object.values(json.bin)[0])
}

/**
 * Resolve the binary path for a package
 * @param module The name of the package to resolve
 * @param bin The name of the binary to resolve
 * @param ensure Whether to ensure the package is installed
 */
export function resolveImportBinSync(module: string, bin?: string, ensure?: true): string
export function resolveImportBinSync(module: string, bin?: string, ensure?: false): string | undefined
export function resolveImportBinSync(module: string, bin?: string, ensure = false): string | undefined {
  const root = path.dirname(resolveImportSync(`${module}/package.json`, ensure as true))
  const json = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))
  return path.join(root, bin ? json.bin[bin] : Object.values(json.bin)[0])
}
