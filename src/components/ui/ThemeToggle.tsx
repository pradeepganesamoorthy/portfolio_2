'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={resolvedTheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '100px',
        border: '1px solid var(--border-strong)',
        background: resolvedTheme === 'dark' ? 'var(--fg)' : 'var(--bg-subtle)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
      }}
    >
      <span style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: resolvedTheme === 'dark' ? 'var(--bg)' : 'var(--fg)',
        display: 'block',
        transition: 'transform 0.2s',
        transform: resolvedTheme === 'dark' ? 'translateX(18px)' : 'translateX(0)',
        fontSize: '0.6rem',
        lineHeight: '16px',
        textAlign: 'center',
      }}>
        {resolvedTheme === 'dark' ? '☽' : '✦'}
      </span>
    </button>
  )
}
