'use client'
import { usePortfolio } from '@/hooks/usePortfolio'

export function Education() {
  const { items, loading } = usePortfolio('education')

  return (
    <section id="education" className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,217,61,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">Background</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>Education</h2>
        </div>

        {loading ? (
          <div className="card" style={{ height: '100px' }} />
        ) : (
          items.map(item => {
            const v = item.value as {
              degree?: string; field?: string; institution?: string;
              location?: string; startYear?: string; endYear?: string
            }
            return (
              <div key={String(item.id)} className="card" style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
                  background: 'linear-gradient(to bottom, #ffd93d, #ff9a3c)',
                  borderRadius: '4px 0 0 4px',
                }} />
                <div style={{ paddingLeft: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {v?.degree}
                    <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}> — {v?.field}</span>
                  </h3>
                  <p style={{ color: '#ffd93d', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', textShadow: '0 0 12px rgba(255,217,61,0.4)' }}>
                    {v?.institution}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-subtle)', marginTop: '0.2rem' }}>
                    {v?.location}
                  </p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                  padding: '0.4rem 1rem', borderRadius: '100px',
                  background: 'rgba(255,217,61,0.1)',
                  border: '1px solid rgba(255,217,61,0.3)',
                  color: '#ffd93d',
                  whiteSpace: 'nowrap',
                }}>
                  {v?.startYear} — {v?.endYear}
                </span>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
