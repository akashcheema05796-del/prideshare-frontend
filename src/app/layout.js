import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pride Share - PNW Carpool Network',
  description: 'Find carpool buddies at Purdue Northwest. Save money, reduce emissions, make friends.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
