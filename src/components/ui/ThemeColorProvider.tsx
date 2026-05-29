'use client'
import { useEffect, useRef } from 'react'

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const styleEl   = useRef<HTMLStyleElement | null>(null)
  const lastHash  = useRef('')

  useEffect(() => {
    const el = document.createElement('style')
    el.id    = 'pg-theme-vars'
    document.head.appendChild(el)
    styleEl.current = el

    poll()
    const id = setInterval(poll, 2000)
    window.addEventListener('focus', poll)
    document.addEventListener('visibilitychange', () => { if (!document.hidden) poll() })
    return () => { clearInterval(id); window.removeEventListener('focus', poll); el.remove() }
  }, [])

  async function poll() {
    try {
      const { theme: t } = await fetch('/api/theme', { cache:'no-store' }).then(r => r.json())
      if (!t) return

      const p   = t.primaryColor   || '#3ddc97'
      const s   = t.secondaryColor || '#237a57'
      const a   = t.accentColor    || '#6ee7b7'
      const h   = t.hoverColor     || '#a7f3d0'
      const nav = t.navbarBgColor  || 'rgba(7,33,28,0.92)'

      // Per-section font colors (stored as JSON in sectionFontColors field)
      let sfc: Record<string,string> = {}
      try { sfc = t.sectionFontColors ? JSON.parse(t.sectionFontColors) : {} } catch {}

      const hash = [p,s,a,h,nav,JSON.stringify(sfc)].join('|')
      if (hash === lastHash.current) return
      lastHash.current = hash

      ;(window as any).__themeColors = [p, s, a, h, '#e8f5f0', p]

      // Build per-section CSS
      const sectionVars = Object.entries(sfc)
        .filter(([,v]) => v && v !== '')
        .map(([k,v]) => `--fg-${k}: ${v};`)
        .join('\n          ')

      if (!styleEl.current) return
      styleEl.current.textContent = `
        :root, [data-theme='dark'], [data-theme='light'] {
          --theme-primary:   ${p};
          --theme-secondary: ${s};
          --theme-accent:    ${a};
          --theme-hover:     ${h};
          --theme-navbar-bg: ${nav};
          --accent-warm:     ${p};
          --accent-cool:     ${s};
          ${sectionVars}
        }

        /* Gradient text — shimmer MUST keep running */
        .gradient-text {
          background-image: linear-gradient(
            135deg, ${p} 0%, ${a} 35%, ${s} 70%, ${p} 100%
          ) !important;
          background-size: 300% 300% !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          animation: shimmer 4s ease infinite !important;
          filter: drop-shadow(0 0 16px ${p}) !important;
        }

        /* About heading glow */
        .about-heading-glow { text-shadow: 0 0 30px ${p}44, 0 0 60px ${p}22 !important; }

        /* Stats */
        .pg-stat-0 { color:${a}!important; text-shadow:0 0 22px ${a}55!important; }
        .pg-stat-1 { color:${h}!important; text-shadow:0 0 22px ${h}55!important; }
        .pg-stat-2 { color:${s}!important; text-shadow:0 0 22px ${s}55!important; }
        .pg-stat-3 { color:${p}!important; text-shadow:0 0 22px ${p}55!important; }

        /* Navbar */
        header.pg-header.is-scrolled {
          background: ${nav} !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
        }

        /* Hire badge & hero glows */
        .pg-hire-badge { background:linear-gradient(135deg,${p}22,${s}22)!important; border-color:${p}44!important; color:${p}!important; }
        .pg-glow-top   { background:radial-gradient(circle,${p}28 0%,transparent 70%)!important; }
        .pg-glow-bot   { background:radial-gradient(circle,${s}22 0%,transparent 70%)!important; }

        /* Section labels */
        .section-label { color: ${p} !important; }

        /* Buttons */
        .btn-warm               { background:linear-gradient(135deg,${p},${a})!important; }
        .btn-warm:hover         { box-shadow:0 8px 30px ${p}55!important; }
        .btn-outline:hover      { border-color:${p}!important; box-shadow:0 0 20px ${p}30!important; }

        /* Cards */
        .card:hover             { box-shadow:0 20px 60px rgba(0,0,0,0.15),0 0 40px ${p}28!important; }
        .card::before           { background:linear-gradient(135deg,${a},${h},${s},${p},${a})!important; background-size:300% 300%!important; }
        .card::after            { background:linear-gradient(90deg,${a},${h},${s},${p},${a})!important; background-size:200% 100%!important; }

        /* Tags */
        .tag:hover { background:linear-gradient(135deg,${a}22,${p}22)!important; border-color:${p}66!important; }

        /* Divider / scrollbar / selection / cursor */
        .section-divider        { background:linear-gradient(90deg,transparent,${p},${s},${a},transparent)!important; }
        ::-webkit-scrollbar-thumb { background:linear-gradient(to bottom,${a},${p})!important; }
        ::selection             { background:${p}!important; color:#fff!important; }
        .cursor-dot             { background:${p}!important; }
        .cursor-ring            { border-color:${p}99!important; }
        input:focus, textarea:focus, select:focus { border-color:${p}!important; box-shadow:0 0 0 3px ${p}22!important; }

        /* Ambient orbs */
        #pg-orb-1 { background:radial-gradient(circle,${p}14 0%,transparent 70%)!important; }
        #pg-orb-2 { background:radial-gradient(circle,${s}11 0%,transparent 70%)!important; }
        #pg-orb-3 { background:radial-gradient(circle,${a}09 0%,transparent 70%)!important; }
      `
    } catch { /* silent */ }
  }

  return <>{children}</>
}
