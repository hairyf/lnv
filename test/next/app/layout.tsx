import type { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): ReactNode {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
