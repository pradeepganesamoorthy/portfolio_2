'use client'
import { useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'

const PROJECT_COLORS = [
  { from: '#ff6b6b', to: '#ffd93d', icon: '⬡' },
  { from: '#4d96ff', to: '#c77dff', icon: '◈' },
  { from: '#6bcb77', to: '#00d2ff', icon: '◎' },
  { from: '#ff9a3c', to: '#ff6b6b', icon: '⬢' },
]

export function Projects() {
  const { items, loading } = usePortfolio('projects')
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section id="projects" className="section-pad" style={{ background: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '30%', right: '10%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(199,125,255,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">Work</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>Key projects</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card" style={{ height: '220px' }} />
            ))
          ) : (
            items.map((item, idx) => {
              const v = item.value as {
                title?: string; company?: string; period?: string;
                description?: string; tags?: string[]; featured?: boolean
              }
              const palette = PROJECT_COLORS[idx % PROJECT_COLORS.length]
              const isHov = hoveredId === String(item.id)

              return (
                <div
                  key={String(item.id)}
                  className="card"
                  style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', background: 'var(--bg-card)' }}
                  onClick={() => setSelected(item.value as Record<string, unknown>)}
                  onMouseEnter={() => setHoveredId(String(item.id))}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Top gradient accent */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: `linear-gradient(90deg, ${palette.from}, ${palette.to})`,
                    opacity: isHov ? 1 : 0.5,
                    transition: 'opacity 0.3s',
                  }} />

                  {/* Icon */}
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '0.75rem',
                    color: isHov ? palette.from : 'var(--fg-subtle)',
                    transition: 'color 0.3s, transform 0.3s',
                    transform: isHov ? 'scale(1.15) rotate(10deg)' : 'scale(1) rotate(0)',
                    display: 'inline-block',
                    lineHeight: 1,
                  }}>
                    {palette.icon}
                  </div>

                  {v?.featured && (
                    <span style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                      color: 'white', fontSize: '0.62rem',
                      padding: '0.15rem 0.65rem', borderRadius: '100px',
                      fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', fontWeight: 600,
                    }}>
                      FEATURED
                    </span>
                  )}

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{v?.title}</h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: palette.from, marginBottom: '0.75rem' }}>
                    {v?.company} · {v?.period}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--fg-muted)', lineHeight: 1.65, marginBottom: '1rem' }}>
                    {v?.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {v?.tags?.map((t: string) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="card"
            style={{ maxWidth: '600px', width: '100%', background: 'var(--bg-card)', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '0.5rem' }}>{(selected as { title?: string }).title}</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-warm)', marginBottom: '1rem' }}>
              {(selected as { company?: string }).company} · {(selected as { period?: string }).period}
            </p>
            <p style={{ color: 'var(--fg-muted)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              {(selected as { description?: string }).description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {((selected as { tags?: string[] }).tags || []).map((t: string) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="btn btn-outline" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </section>
  )
}
