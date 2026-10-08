import { Montserrat } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap'
})

export const metadata = {
  title: 'Dr Lalchandani Labs | 40 Years of Trust | Diagnostic Laboratory in New Delhi',
  description: 'Trusted diagnostic laboratory in New Delhi. 40 Years of Trust, 500+ tests, reports in 6 hours. Home sample collection available.',
  keywords: 'diagnostic lab, blood test, 40 Years of Trust, New Delhi, home collection, health checkup',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
