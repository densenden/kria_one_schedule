import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/providers/Providers'

const publicSans = Public_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KRIA Training Community',
  description: 'Book sports courses and connect with the community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={publicSans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}