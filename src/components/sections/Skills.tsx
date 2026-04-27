'use client'
import { usePortfolio } from '@/hooks/usePortfolio'

const CATEGORY_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  'Languages & Tools':   { from: '#ff6b6b', to: '#ffd93d', glow: '#ff6b6b' },
  'Cloud & Databases':   { from: '#4d96ff', to: '#00d2ff', glow: '#4d96ff' },
  'Data Engineering':    { from: '#6bcb77', to: '#ffd93d', glow: '#6bcb77' },
  'Frameworks & Libraries': { from: '#c77dff', to: '#ff6b6b', glow: '#c77dff' },
}

const DEFAULT_COLORS = { from: '#ff9a3c', to: '#c77dff', glow: '#ff9a3c' }

export function Skills() {
  const { items, loading } = usePortfolio('skills')

  return (
    <section id="skills" className="section-pad" style={{ background: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
      {/* background glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(77,150,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">Technical Skills</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>
            Stack & expertise
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card" style={{ height: '160px' }} />
            ))
          ) : (
            items.map((item, idx) => {
              const v = item.value as { category?: string; items?: string[] }
              const colors = CATEGORY_COLORS[v?.category || ''] || DEFAULT_COLORS
              return (
                <div
                  key={String(item.id)}
                  className="card"
                  style={{
                    background: 'var(--bg-card)',
                    animationDelay: `${idx * 0.1}s`,
                    cursor: 'default',
                  }}
                >
                  {/* Category header with gradient bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      width: '32px', height: '3px',
                      borderRadius: '2px',
                      background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                      marginBottom: '0.75rem',
                      boxShadow: `0 0 8px ${colors.glow}60`,
                    }} />
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}>
                      {v?.category}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {v?.items?.map((skill: string, si: number) => (
                      <span
                        key={skill}
                        className="tag"
                        style={{
                          transitionDelay: `${si * 0.03}s`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
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
