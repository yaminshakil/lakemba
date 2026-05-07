import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Lakemba General Medical Practice | Your Local GP',
    template: '%s | Lakemba General Medical Practice',
  },
  description:
    'Lakemba General Medical Practice – trusted, compassionate healthcare in the heart of Lakemba. Book online with HotDoc. Bulk-billing available.',
  keywords: 'Lakemba GP, doctor Lakemba, bulk billing, medical centre Lakemba, general practice NSW',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://lakembagmp.com.au',
    siteName: 'Lakemba General Medical Practice',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
