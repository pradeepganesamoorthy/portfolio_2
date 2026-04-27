'use client'
import { usePortfolio } from '@/hooks/usePortfolio'

const AWARD_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c']

export function Awards() {
  const { items, loading } = usePortfolio('awards')

  const allAwards: Array<{ title: string; issuer: string; date: string }> = []
  items.forEach(item => {
    const v = item.value as { items?: Array<{ title: string; issuer: string; date: string }> }
    if (v?.items) allAwards.push(...v.items)
  })

  if (!loading && allAwards.length === 0) return null

  return (
    <section className="section-pad" style={{ background: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '20%', left: '20%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,217,61,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
        animation: 'glowPulse 5s ease-in-out infinite',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-label">Recognition</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>Awards</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
          {allAwards.map((award, i) => {
            const color = AWARD_COLORS[i % AWARD_COLORS.length]
            return (
              <div key={i} className="card" style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.85rem 1.25rem',
                flex: '0 0 auto',
              }}>
                <span style={{
                  color,
                  fontSize: '1.2rem',
                  textShadow: `0 0 10px ${color}80`,
                  animation: 'glowPulse 2s ease-in-out infinite',
                  animationDelay: `${i * 0.3}s`,
                  display: 'inline-block',
                }}>★</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{award.title}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color }}>
                    {award.issuer} · {award.date}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
