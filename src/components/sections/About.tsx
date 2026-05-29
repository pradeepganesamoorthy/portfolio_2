'use client'
import { usePortfolio } from '@/hooks/usePortfolio'
import Image from 'next/image'

const STAT_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#c77dff']
const STAT_CLASSES = ['pg-stat-0','pg-stat-1','pg-stat-2','pg-stat-3']

export function About() {
  const { getValue, loading } = usePortfolio('about')
  const about = getValue('main') as {
    bio?: string; location?: string; email?: string;
    phone?: string; linkedin?: string; github?: string; profileImage?: string
  } | null

  const stats: {
  value: string
  label: string
  detail?: string
}[] = [
  {
    value: '6+',
    label: 'Years exp',
    detail: 'Python • SQL • Data Engineering',
  },
  {
    value: '3',
    label: 'Companies',
    detail: 'TCS • NHM Tech • SathyaSaran',
  },
  {
    value: '6',
    label: 'TCS awards',
    detail: 'Recognition for delivery',
  },
  {
    value: '40%',
    label: 'Speed gain',
    detail: 'ETL optimization',
  },
]

  return (
    <section id="about" className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-5%', right: '-5%',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,210,61,0.07) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">About me</span>
          <h2 className="about-heading-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>
            Turning raw data into<br />
            <span className="gradient-text">reliable insight</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="about-grid">
          <div>
            {/* Profile Image */}
            {about?.profileImage && (
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 'clamp(140px, 30vw, 180px)', height: 'clamp(140px, 30vw, 180px)' }}>
                  <div style={{
                    position: 'absolute', inset: '-6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff, #ff9a3c)',
                    backgroundSize: '300% 300%',
                    animation: 'rainbowShift 4s ease infinite',
                    filter: 'blur(8px)',
                    opacity: 0.6,
                  }} />
                  <div style={{
                    position: 'relative',
                    width: '100%', height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid var(--bg-card)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  }}>
                    <Image
                      src={about.profileImage}
                      alt="Pradeep Ganesamoorthy"
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                      sizes="(max-width: 480px) 140px, (max-width: 768px) 160px, 180px"
                    />
                  </div>
                </div>
              </div>
            )}

            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', lineHeight: 1.8, color: 'var(--fg-muted)', marginBottom: '2rem' } } className="text-muted">
              {loading ? 'Loading...' : about?.bio}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Location', value: about?.location, icon: '◎', color: 'var(--theme-accent,#ff6b6b)' },
                { label: 'Email', value: about?.email, icon: '✉', color: 'var(--theme-secondary,#4d96ff)' },
                { label: 'Phone', value: about?.phone, icon: '◉', color: 'var(--theme-hover,#6bcb77)' },
              ].map(item => item.value && (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: 'clamp(0.5rem, 1.5vw, 0.65rem) clamp(0.75rem, 2vw, 1rem)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = item.color + '60'
                    el.style.boxShadow = `0 0 16px ${item.color}20`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ color: item.color, fontSize: '1rem', width: '20px', textAlign: 'center', textShadow: `0 0 8px ${item.color}60` }}>{item.icon}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.75rem, 1.8vw, 0.83rem)', color: 'var(--fg-muted)', wordBreak: 'break-word' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flip-card" style={{ height: 'clamp(120px, 18vw, 160px)' }}>
                <div className="flip-inner">
                  {/* Front — value + label */}
                  <div className="flip-front" style={{ textAlign: 'center', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `radial-gradient(circle at center, ${STAT_COLORS[i]}12 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }} />
                    <div className={STAT_CLASSES[i]}>{stat.value}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(0.6rem, 1.4vw, 0.68rem)',
                      color: 'var(--fg-subtle)',
                      letterSpacing: '0.1em',
                      marginTop: '0.5rem',
                    }}>
                      {stat.label.toUpperCase()}
                    </div>
                  </div>
                  {/* Back — description, always dark text on green bg */}
                  <div className="flip-back" style={{ textAlign: 'center', gap: '0.4rem' }}>
                    <div style={{
                      fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      color: '#07211c',
                    }}>{stat.value}</div>
                    <div style={{
                      fontSize: 'clamp(0.72rem, 1.6vw, 0.8rem)',
                      fontWeight: 600,
                      color: '#07211c',
                      letterSpacing: '0.05em',
                    }}>{stat.label}</div>
                    {stat.detail && (
                      <div style={{
                        fontSize: 'clamp(0.62rem, 1.3vw, 0.7rem)',
                        color: '#07211c',
                        opacity: 0.75,
                        marginTop: '0.25rem',
                        lineHeight: 1.4,
                      }}>{stat.detail}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
