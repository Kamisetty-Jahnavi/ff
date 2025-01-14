import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SocketProvider from '@/components/SocketProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Identity and Learning',
  description: 'A platform for digital identity and learning management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  )
}

