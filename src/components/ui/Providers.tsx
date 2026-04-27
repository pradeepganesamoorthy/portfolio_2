'use client'
import { ThemeProvider } from 'next-themes'
import { AdminProvider } from '@/hooks/useAdmin'
import { CustomCursor } from './CustomCursor'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <AdminProvider>
        <CustomCursor />
        {children}
      </AdminProvider>
    </ThemeProvider>
  )
}
