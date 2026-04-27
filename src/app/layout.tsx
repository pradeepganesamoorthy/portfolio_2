import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/ui/Providers'

export const metadata: Metadata = {
  title: 'Pradeep Ganesamoorthy — Data Engineer',
  description: 'Data Engineer with 6+ years building ETL/ELT pipelines, BigQuery, Python, cloud data platforms.',
  keywords: ['Data Engineer', 'ETL', 'BigQuery', 'Python', 'SQL', 'GCP'],
  openGraph: {
    title: 'Pradeep Ganesamoorthy — Data Engineer',
    description: 'Data Engineer with 6+ years building enterprise-scale data systems.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="noise-overlay" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
