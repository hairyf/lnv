import type { ReactNode } from 'react'
import process from 'node:process'

export default function Page(): ReactNode {
  return (
    <h1>
      {process.env.NEXT_PUBLIC_DEFAULT_A1}
      , Next.js!
    </h1>
  )
}
