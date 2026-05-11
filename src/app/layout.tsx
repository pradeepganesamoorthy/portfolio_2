import type { Metadata } from 'next'
import { Providers } from '@/components/ui/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pradeep Ganesamoorthy - Data Engineer Portfolio',
  description: 'Data Engineer with 6+ years experience in ETL, BigQuery, Python, GCP. Built enterprise pipelines at PayPal and TCS.',
  keywords: 'Pradeep Ganesamoorthy, Data Engineer, ETL Developer, BigQuery, Python, GCP, PayPal, TCS, Bangalore',
  authors: [{ name: 'Pradeep Ganesamoorthy' }],
  openGraph: {
    title: 'Pradeep Ganesamoorthy - Data Engineer Portfolio',
    description: 'Data Engineer with 6+ years experience in ETL, BigQuery, Python, GCP',
    url: 'https://portfolio-2-4krw.vercel.app',
    siteName: 'Pradeep Ganesamoorthy Portfolio',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Pradeep Ganesamoorthy',
              jobTitle: 'Data Engineer',
              url: 'https://portfolio-2-4krw.vercel.app',
              sameAs: [
                'https://linkedin.com/in/pradeepganesamoorthy',
                'https://github.com/pradeepganesh',
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'PayPal',
              },
            }),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
