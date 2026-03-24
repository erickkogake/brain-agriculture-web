import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { Providers } from '@/components/layout/Providers'
import { Sidebar } from '@/components/layout/Sidebar'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Brain Agriculture', template: '%s | Brain Agriculture' },
  description: 'Plataforma de gestão de produtores rurais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
              {children}
            </main>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: 'font-sans text-sm',
                success: '!bg-meadow-50 !border-meadow-200 !text-meadow-900',
                error: '!bg-red-50 !border-red-200 !text-red-900',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
