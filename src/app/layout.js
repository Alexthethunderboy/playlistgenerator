import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Music Playlist Generator',
  description: 'Generate music playlists based on genres using AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen  text-white`}>
        {children}
      </body>
    </html>
  )
}

