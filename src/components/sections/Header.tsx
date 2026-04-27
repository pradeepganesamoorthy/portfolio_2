'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useAdmin } from '@/hooks/useAdmin'
import { AdminModal } from '@/components/admin/AdminModal'
import Link from 'next/link'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'GitHub', href: '#github' },
  { label: 'Contact', href: '#contact' },
]

const NAV_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c']

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const { admin, logout } = useAdmin()

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(var(--bg-card-rgb, 255,255,255), 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}>
        {/* Logo */}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.04em' }}>
          <span style={{ color: 'var(--accent-warm)', textShadow: '0 0 12px rgba(200,96,42,0.4)' }}>P</span>
          <span style={{ color: 'var(--fg)' }}>G</span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                color: 'var(--fg-muted)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                position: 'relative',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = NAV_COLORS[i]
                el.style.background = `${NAV_COLORS[i]}15`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'var(--fg-muted)'
                el.style.background = 'transparent'
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              style={{
                width: '38px', height: '22px',
                borderRadius: '100px',
                border: '1px solid var(--border-strong)',
                background: resolvedTheme === 'dark'
                  ? 'linear-gradient(135deg, #c77dff, #4d96ff)'
                  : 'linear-gradient(135deg, #ffd93d, #ff9a3c)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s',
                padding: '2px',
                display: 'flex', alignItems: 'center',
              }}
              aria-label="Toggle theme"
            >
              <span style={{
                width: '16px', height: '16px', borderRadius: '50%',
                background: 'white',
                display: 'block',
                transition: 'transform 0.3s',
                transform: resolvedTheme === 'dark' ? 'translateX(16px)' : 'translateX(0)',
                fontSize: '0.55rem', lineHeight: '16px', textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}>
                {resolvedTheme === 'dark' ? '☽' : '✦'}
              </span>
            </button>
          )}

          {admin ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/admin" className="btn btn-warm" style={{ padding: '0.4rem 0.9rem', fontSize: '0.76rem' }}>
                CMS
              </Link>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.76rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdminModalOpen(true)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                color: 'var(--fg-subtle)', background: 'none', border: 'none',
                cursor: 'pointer', letterSpacing: '0.08em', padding: '0.3rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-warm)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-subtle)')}
            >
              admin
            </button>
          )}
        </div>
      </header>

      <AdminModal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  )
}
