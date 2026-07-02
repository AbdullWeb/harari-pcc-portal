import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Harari PCC Portal | Professional Competence Certificate Platform',
  description: 'Official digital platform for PCC issuance — Harari People Regional State, Ethiopia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full">{children}</body>
    </html>
  )
}
