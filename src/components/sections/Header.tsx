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

  // Read navbar color from CSS variable (set by ThemeColorProvider)
  const getNavbarBg = () => {
    if (!scrolled) return 'transparent'
    // Use the CSS variable --theme-navbar-bg if it's been set, else fallback
    return 'var(--theme-navbar-bg, rgba(8,8,8,0.85))'
  }

  return (
    <>
      <header className={`pg-header${scrolled ? ' is-scrolled' : ''}`} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        background: getNavbarBg(),
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}>
        {/* Logo */}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.04em' }}>
          <span style={{ color: 'var(--theme-primary, var(--accent-warm))', textShadow: '0 0 12px var(--theme-primary, rgba(200,96,42,0.4))' }}>P</span>
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
                // Use theme primary color for hover
                const hoverColor = getComputedStyle(document.documentElement)
                  .getPropertyValue('--theme-hover').trim() || '#ffd93d'
                el.style.color = hoverColor
                el.style.background = hoverColor + '20'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: '50%', width: '34px', height: '34px',
                cursor: 'pointer', color: 'var(--fg-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--theme-primary, var(--accent-warm))'
                el.style.color = 'var(--theme-primary, var(--accent-warm))'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--fg-muted)'
              }}
            >
              {resolvedTheme === 'dark' ? '☀' : '◐'}
            </button>
          )}

          {admin ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link
                href="/admin"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  color: 'var(--theme-primary, var(--accent-warm))',
                  textDecoration: 'none', padding: '0.3rem 0.6rem',
                  border: '1px solid var(--theme-primary, var(--accent-warm))',
                  borderRadius: 'var(--radius-sm)', transition: 'all 0.2s',
                }}
              >
                Admin
              </Link>
              <button
                onClick={logout}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  color: 'var(--fg-subtle)', transition: 'color 0.2s',
                }}
              >
                logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdminModalOpen(true)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.3rem 0.6rem',
                color: 'var(--fg-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--theme-primary, var(--accent-warm))'
                el.style.color = 'var(--theme-primary, var(--accent-warm))'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--fg-subtle)'
              }}
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
