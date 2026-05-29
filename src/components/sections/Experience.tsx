'use client'
import { useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'

const TIMELINE_COLORS = ['#3ddc97','#6ee7b7','#237a57','#a7f3d0','#0d5c40']

export function Experience() {
  const { items: rawItems, loading } = usePortfolio('experience')
  // Sort by order descending so TCS (most recent) appears first
  const items = [...rawItems].sort((a, b) => {
    const ao = (a as any).order ?? 0
    const bo = (b as any).order ?? 0
    return bo - ao
  })
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="experience" className="section-pad" style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <span className="section-label">Career</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>Work experience</h2>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Timeline line with gradient */}
          <div style={{
            position: 'absolute',
            left: '7px', top: 0, bottom: 0, width: '2px',
            background: 'linear-gradient(to bottom, #ff6b6b, #ffd93d, #6bcb77, transparent)',
            borderRadius: '2px',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ paddingLeft: '2.5rem' }}>
                  <div style={{ height: '160px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }} />
                </div>
              ))
            ) : (
              items.map((item, idx) => {
                const v = item.value as {
                  title?: string; company?: string; project?: string;
                  startDate?: string; endDate?: string; current?: boolean;
                  bullets?: string[]
                }
                const color = TIMELINE_COLORS[idx] || '#c77dff'
                const isHovered = hovered === String(item.id)

                return (
                  <div
                    key={String(item.id)}
                    style={{ paddingLeft: '2.5rem', position: 'relative' }}
                    onMouseEnter={() => setHovered(String(item.id))}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: 0, top: '22px',
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: color,
                      boxShadow: `0 0 ${isHovered ? '16px' : '6px'} ${color}80`,
                      transition: 'box-shadow 0.3s',
                      zIndex: 2,
                    }} />

                    <div className="card" style={{
                      borderLeft: isHovered ? `2px solid ${color}` : '2px solid transparent',
                      transition: 'border-color 0.3s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>{v?.title}</h3>
                          <p style={{ color, fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>
                            {v?.company}
                          </p>
                          {v?.project && (
                            <p style={{ color: 'var(--fg-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>{v.project}</p>
                          )}
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                          padding: '0.25rem 0.85rem', borderRadius: '100px',
                          background: `${color}15`,
                          border: `1px solid ${color}40`,
                          color,
                        }}>
                          {v?.startDate} — {v?.current ? 'Present' : v?.endDate}
                        </span>
                      </div>
                      <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {v?.bullets?.map((b: string, i: number) => (
                          <li key={i} style={{ fontSize: '0.88rem', color: 'var(--fg-muted)', lineHeight: 1.65 }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
