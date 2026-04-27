'use client'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Rainbow line at top */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff, #ff9a3c, #ff6b6b)',
        backgroundSize: '200% 100%',
        animation: 'rainbowSlide 3s linear infinite',
      }} />

      <div style={{ background: 'var(--bg-subtle)', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.04em' }}>
            <span style={{ color: 'var(--accent-warm)', textShadow: '0 0 12px rgba(200,96,42,0.4)' }}>P</span>
            <span>G</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--fg-subtle)' }}>
            Pradeep Ganesamoorthy · Data Engineer · Bangalore
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fg-subtle)' }}>
            © {year}
          </p>
        </div>
      </div>
    </footer>
  )
}
