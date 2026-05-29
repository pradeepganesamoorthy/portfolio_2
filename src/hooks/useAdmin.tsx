'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface AdminUser { id: string; username: string; isDefault: boolean }
interface AdminCtx {
  admin:     AdminUser | null
  isLoading: boolean
  login:     (u: string, p: string) => Promise<{ success: boolean; isDefault?: boolean; error?: string }>
  logout:    () => Promise<void>
  refresh:   () => Promise<void>
}

const Ctx = createContext<AdminCtx | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin,     setAdmin]     = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (!res.ok) { setAdmin(null); return }
      const { admin: a } = await res.json()
      setAdmin(a ?? null)
    } catch {
      setAdmin(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const login = async (username: string, password: string) => {
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) { await refresh(); return { success: true, isDefault: data.isDefault } }
      return { success: false, error: data.error || 'Invalid credentials' }
    } catch {
      return { success: false, error: 'Network error — is the server running?' }
    }
  }

  const logout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}
    setAdmin(null)
  }

  return <Ctx.Provider value={{ admin, isLoading, login, logout, refresh }}>{children}</Ctx.Provider>
}

export function useAdmin() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider')
  return ctx
}
