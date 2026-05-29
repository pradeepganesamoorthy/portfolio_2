'use client'
import { ThemeProvider } from 'next-themes'
import { AdminProvider } from '@/hooks/useAdmin'
import { CustomCursor } from './CustomCursor'
import { ThemeColorProvider } from './ThemeColorProvider'
import { PageFX } from './PageFX'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <AdminProvider>
        <ThemeColorProvider>
          <CustomCursor />
          <PageFX />
          {children}
        </ThemeColorProvider>
      </AdminProvider>
    </ThemeProvider>
  )
}
