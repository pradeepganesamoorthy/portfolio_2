'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface AdminUser {
  id: string
  username: string
  isDefault: boolean
}

interface AdminContextType {
  admin: AdminUser | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; isDefault?: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setAdmin(data.admin)
    } catch {
      setAdmin(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const login = async (username: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (data.success) { await refresh(); return { success: true, isDefault: data.isDefault } }
    return { success: false, error: data.error }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, isLoading, login, logout, refresh }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider')
  return ctx
}
