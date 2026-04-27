'use client'
import { useState } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { useRouter } from 'next/navigation'

interface Props {
  open: boolean
  onClose: () => void
}

export function AdminModal({ open, onClose }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const router = useRouter()

  if (!open) return null

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const result = await login(username, password)
    setLoading(false)
    if (result.success) {
      onClose()
      if (result.isDefault) {
        router.push('/admin?changeCredentials=1')
      } else {
        router.push('/admin')
      }
    } else {
      setError(result.error || 'Invalid credentials')
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2rem',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '0.35rem' }}>Admin login</h2>
        <p style={{ color: 'var(--fg-muted)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
          Default credentials: admin / admin
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: '#e07840', fontSize: '0.85rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn btn-warm"
            style={{ flex: 1 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  )
}
