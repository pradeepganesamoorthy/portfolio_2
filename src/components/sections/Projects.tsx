'use client'
import { useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'

const PROJECT_PALETTE = [
  { from: '#3ddc97', to: '#6ee7b7' },
  { from: '#237a57', to: '#3ddc97' },
  { from: '#6ee7b7', to: '#a7f3d0' },
  { from: '#093028', to: '#237a57' },
]

export function Projects() {
  const { items, loading } = usePortfolio('projects')
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null)

  return (
    <section id="projects" className="section-pad" style={{ background: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '5%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, var(--theme-primary,#3ddc97)10 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">Work</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>Key projects</h2>
          <p style={{ color: 'var(--fg-muted)', marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            Hover a card to see details ↻
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ height: '220px', animation: 'none' }} />
              ))
            : items.map((item, idx) => {
                const v = item.value as {
                  title?: string; company?: string; period?: string;
                  description?: string; tags?: string[]; featured?: boolean; link?: string;
                }
                const p = PROJECT_PALETTE[idx % PROJECT_PALETTE.length]

                return (
                  <div
                    key={String(item.id)}
                    className="flip-card"
                    style={{ height: '240px' }}
                    onClick={() => setSelected(item.value as Record<string, unknown>)}
                  >
                    <div className="flip-inner">

                      {/* ── FRONT ── */}
                      <div className="flip-front" style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 0 }}>
                        {/* Top color bar */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                          background: `linear-gradient(90deg, ${p.from}, ${p.to})`,
                          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                        }} />

                        <div style={{ width: '100%', paddingTop: '0.5rem' }}>
                          {v.featured && (
                            <span style={{
                              display: 'inline-block', padding: '0.15rem 0.6rem',
                              background: `${p.from}25`, border: `1px solid ${p.from}50`,
                              borderRadius: '100px', fontSize: '0.65rem',
                              fontFamily: 'var(--font-mono)', color: p.from,
                              marginBottom: '0.6rem', letterSpacing: '0.06em',
                            }}>★ FEATURED</span>
                          )}
                          <h3 style={{
                            fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                            fontWeight: 700, color: 'var(--fg)', marginBottom: '0.4rem', lineHeight: 1.2,
                          }}>{v.title}</h3>
                          <p style={{ color: 'var(--fg-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                            {v.company}{v.period ? ` · ${v.period}` : ''}
                          </p>
                        </div>

                        {/* Tags preview */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', width: '100%', marginTop: 'auto' }}>
                          {v.tags?.slice(0,3).map(tag => (
                            <span key={tag} style={{
                              padding: '0.15rem 0.5rem', borderRadius: '100px',
                              fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                              background: `${p.from}18`, border: `1px solid ${p.from}35`,
                              color: 'var(--fg-muted)',
                            }}>{tag}</span>
                          ))}
                          {(v.tags?.length || 0) > 3 && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
                              +{(v.tags?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ── BACK ── */}
                      <div className="flip-back" style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#07211c', lineHeight: 1.2 }}>
                          {v.title}
                        </h3>
                        <p style={{
                          fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', color: '#07211c',
                          lineHeight: 1.55, flex: 1, overflow: 'hidden',
                          display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as any,
                        }}>
                          {v.description || 'Click to see full details'}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', width: '100%' }}>
                          {v.tags?.slice(0,4).map(tag => (
                            <span key={tag} style={{
                              padding: '0.12rem 0.45rem', borderRadius: '100px',
                              fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
                              background: 'rgba(7,33,28,0.25)', color: '#07211c',
                              border: '1px solid rgba(7,33,28,0.2)',
                            }}>{tag}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#07211c', opacity: 0.7, fontFamily: 'var(--font-mono)', alignSelf: 'flex-end' }}>
                          Click for full details →
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(7,33,28,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', padding: '2.5rem',
              maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--fg)' }}>{(selected as any).title}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '1rem' }}>
              {(selected as any).company}{(selected as any).period ? ` · ${(selected as any).period}` : ''}
            </p>
            <p style={{ color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{(selected as any).description}</p>
            {(selected as any).tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(selected as any).tags.map((t: string) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
