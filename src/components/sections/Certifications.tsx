'use client'
import { usePortfolio } from '@/hooks/usePortfolio'

const ISSUER_THEMES: Record<string, { color: string; bg: string }> = {
  Oracle:      { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
  Google:      { color: 'var(--theme-secondary,#237a57)', bg: 'rgba(35,122,87,0.1)' },
  Udemy:       { color: 'var(--theme-primary,#3ddc97)', bg: 'rgba(61,220,151,0.1)' },
  Credly:      { color: '#6bcb77', bg: 'rgba(107,203,119,0.1)' },
  Dataisgood:  { color: '#ffd93d', bg: 'rgba(255,217,61,0.1)' },
}

export function Certifications() {
  const { items, loading } = usePortfolio('certifications')

  return (
    <section id="certifications" className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '20%', left: '5%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">Credentials</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>Certifications</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem' }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card" style={{ height: '90px' }} />
            ))
          ) : (
            items.map(item => {
              const v = item.value as { title?: string; issuer?: string; date?: string }
              const theme = ISSUER_THEMES[v?.issuer || ''] || { color: '#ff9a3c', bg: 'rgba(255,154,60,0.1)' }

              return (
                <div key={String(item.id)} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px',
                    background: theme.bg,
                    border: `1px solid ${theme.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '0.68rem', fontFamily: 'var(--font-mono)',
                    color: theme.color, fontWeight: 700,
                    boxShadow: `0 0 10px ${theme.color}20`,
                  }}>
                    {(v?.issuer || '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.4, marginBottom: '0.3rem' }}>{v?.title}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: theme.color }}>
                      {v?.issuer} · {v?.date}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
