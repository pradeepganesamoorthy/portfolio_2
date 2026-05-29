'use client'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useEffect, useState } from 'react'

const CATEGORY_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  'Languages & Tools':      { from: '#3ddc97', to: '#6ee7b7', glow: '#3ddc97' },
  'Cloud & Databases':      { from: '#237a57', to: '#3ddc97', glow: '#237a57' },
  'Data Engineering':       { from: '#6ee7b7', to: '#a7f3d0', glow: '#6ee7b7' },
  'Frameworks & Libraries': { from: '#a7f3d0', to: '#3ddc97', glow: '#a7f3d0' },
}
const DEFAULT_COLORS = { from: '#3ddc97', to: '#237a57', glow: '#3ddc97' }

interface Badge {
  id: string
  section: string
  name: string
  type: string
  iconName?: string
  customImage?: string
  color?: string
  order: number
  visible?: boolean
}

// Icon lookup for common tech tools
const TECH_ICONS: Record<string, string> = {
  python: '🐍', javascript: 'JS', typescript: 'TS', java: '☕', go: '🐹', rust: '🦀',
  'c++': 'C++', 'c#': 'C#', swift: '🦅', kotlin: '🎯', sql: '🗃️', scala: '⚡',
  react: '⚛️', vue: '🟢', 'next.js': 'N', angular: '🔴', svelte: '🟠',
  django: '🎸', fastapi: '⚡', 'node.js': '🟩', express: '🚂', spring: '🌿',
  postgresql: '🐘', mysql: '🐬', mongodb: '🍃', redis: '🔴', elasticsearch: '🔍',
  sqlite: '📦', aws: '☁️', gcp: '🌐', azure: '🔷', docker: '🐳', kubernetes: '☸️',
  terraform: '🏗️', git: '📝', github: '🐙', linux: '🐧', nginx: '⚙️',
  figma: '🎨', tailwindcss: '💨', graphql: '◉', rest: '🔗', grpc: '📡',
  bigquery: '📊', airflow: '🌬️', spark: '⚡', kafka: '📨',
  'apache spark': '⚡', 'apache kafka': '📨', 'apache airflow': '🌬️',
  dbt: '🔧', snowflake: '❄️', redshift: '🔴', databricks: '🧱',
  pandas: '🐼', numpy: 'Npy', looker: '👁️', tableau: '📊',
}

function BadgeIcon({ name }: { name: string }) {
  const key = name.toLowerCase()
  const icon = TECH_ICONS[key] || name.slice(0, 2).toUpperCase()
  const isEmoji = /\p{Emoji_Presentation}/u.test(icon)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '18px', height: '18px',
      fontSize: isEmoji ? '13px' : '9px',
      fontWeight: 700, fontFamily: 'var(--font-mono)',
    }}>
      {icon}
    </span>
  )
}

// Individual badge chip — handles both text and image badges
function BadgeChip({ badge, featured }: { badge: Badge; featured?: boolean }) {
  const [spinning, setSpinning] = useState(false)
  const [spinTimer, setSpinTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (spinTimer) clearTimeout(spinTimer)
    setSpinning(true)
    const t = setTimeout(() => setSpinning(false), 2000)
    setSpinTimer(t)
  }

  const isImage = badge.type === 'image' && badge.customImage

  if (isImage) {
    // Certification / image badge
    return (
      <div
        onMouseEnter={handleMouseEnter}
        style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
          padding: featured ? '0.75rem' : '0.5rem',
          borderRadius: '12px',
          border: `1px solid ${badge.color || 'var(--border)'}50`,
          background: `${badge.color || '#c77dff'}10`,
          cursor: 'default',
          transition: 'all 0.25s ease',
          transform: featured ? 'scale(1.08)' : 'scale(1)',
          boxShadow: featured ? `0 4px 20px ${badge.color || '#c77dff'}25` : 'none',
          position: 'relative',
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = featured ? 'scale(1.08)' : 'scale(1)'
          el.style.boxShadow = featured ? `0 4px 20px ${badge.color || '#c77dff'}25` : 'none'
        }}
        onMouseOver={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'scale(1.15)'
          el.style.boxShadow = `0 8px 30px ${badge.color || '#c77dff'}40`
        }}
      >
        <div style={{
          width: featured ? '64px' : '48px',
          height: featured ? '64px' : '48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: spinning ? 'badgeSpin 2s ease-in-out forwards' : 'none',
        }}>
          <img
            src={badge.customImage}
            alt={badge.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: featured ? '0.68rem' : '0.62rem',
          color: badge.color || 'var(--fg-muted)', fontWeight: 600,
          textAlign: 'center', maxWidth: featured ? '80px' : '60px',
          lineHeight: 1.2,
        }}>
          {badge.name}
        </span>
        {featured && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            width: '10px', height: '10px', borderRadius: '50%',
            background: badge.color || '#c77dff',
            boxShadow: `0 0 8px ${badge.color || '#c77dff'}`,
            animation: 'glowPulse 1.5s ease-in-out infinite',
          }} />
        )}
      </div>
    )
  }

  // Text / preset badge
  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseOver={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = featured ? 'scale(1.18)' : 'scale(1.1)'
        el.style.boxShadow = `0 4px 16px ${badge.color || '#c77dff'}30`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = featured ? 'scale(1.08)' : 'scale(1)'
        el.style.boxShadow = featured ? `0 0 12px ${badge.color || '#c77dff'}30` : 'none'
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        padding: featured ? '0.45rem 1rem' : '0.28rem 0.7rem',
        borderRadius: '100px',
        background: `${badge.color || '#c77dff'}15`,
        border: `1px solid ${badge.color || '#c77dff'}50`,
        fontFamily: 'var(--font-mono)',
        fontSize: featured ? '0.82rem' : '0.72rem',
        fontWeight: 600,
        color: badge.color || 'var(--fg)',
        cursor: 'default',
        transition: 'all 0.25s ease',
        transform: featured ? 'scale(1.08)' : 'scale(1)',
        boxShadow: featured ? `0 0 12px ${badge.color || '#c77dff'}30` : 'none',
        position: 'relative',
      }}
    >
      <span style={{
        display: 'inline-block',
        animation: spinning ? 'badgeSpin 2s ease-in-out forwards' : 'none',
      }}>
        <BadgeIcon name={badge.name} />
      </span>
      {badge.name}
      {featured && (
        <span style={{
          position: 'absolute', top: '-6px', right: '-6px',
          width: '10px', height: '10px', borderRadius: '50%',
          background: badge.color || '#c77dff',
          boxShadow: `0 0 6px ${badge.color || '#c77dff'}`,
          animation: 'glowPulse 1.5s ease-in-out infinite',
        }} />
      )}
    </span>
  )
}

// Renders a row of badges for a given section key; hides if none exist
function BadgeRow({ section }: { section: string }) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/badges?section=${encodeURIComponent(section)}`)
      .then(r => r.json())
      .then(d => {
        setBadges((d.badges || []).filter((b: Badge) => b.visible !== false))
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [section])

  if (!loaded || badges.length === 0) return null

  const featured = badges[0]
  const rest = badges.slice(1)

  return (
    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: '0.65rem',
      }}>Badges</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <BadgeChip badge={featured} featured />
        {rest.map(b => <BadgeChip key={b.id} badge={b} />)}
      </div>
    </div>
  )
}

// Global badges section for the "skills" section — shown at bottom of Skills
function GlobalSkillsBadges() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/badges?section=skills')
      .then(r => r.json())
      .then(d => {
        setBadges((d.badges || []).filter((b: Badge) => b.visible !== false))
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  if (!loaded || badges.length === 0) return null

  const imageBadges = badges.filter(b => b.type === 'image' && b.customImage)
  const textBadges = badges.filter(b => b.type !== 'image' || !b.customImage)
  const featured = textBadges[0]
  const restText = textBadges.slice(1)

  return (
    <div style={{
      marginTop: '2.5rem', padding: '1.75rem',
      background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--theme-primary, var(--accent-warm))',
        marginBottom: '1.25rem',
      }}>✦ Skill Badges</p>

      {/* Text badges row */}
      {(featured || restText.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: imageBadges.length > 0 ? '1.25rem' : 0 }}>
          {featured && <BadgeChip badge={featured} featured />}
          {restText.map(b => <BadgeChip key={b.id} badge={b} />)}
        </div>
      )}

      {/* Certification image badges row */}
      {imageBadges.length > 0 && (
        <>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: '0.75rem',
          }}>🏆 Certifications</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
            {imageBadges.map((b, i) => <BadgeChip key={b.id} badge={b} featured={i === 0} />)}
          </div>
        </>
      )}
    </div>
  )
}

export function Skills() {
  const { items, loading } = usePortfolio('skills')

  return (
    <>
      <style>{`
        @keyframes badgeSpin {
          0%   { transform: rotate(0deg) scale(1); }
          20%  { transform: rotate(180deg) scale(1.5); }
          60%  { transform: rotate(340deg) scale(1.25); }
          80%  { transform: rotate(358deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <section id="skills" className="section-pad" style={{ background: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '20%', right: '-5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, var(--theme-secondary, rgba(77,150,255,0.08)) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '3rem' }}>
            <span className="section-label">Technical Skills</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>Stack &amp; expertise</h2>
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
                const sectionKey = v?.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `skills-cat-${idx}`
                return (
                  <div
                    key={String(item.id)}
                    className="card"
                    style={{ background: 'var(--bg-card)', animationDelay: `${idx * 0.1}s`, cursor: 'default' }}
                  >
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{
                        width: '32px', height: '3px', borderRadius: '2px',
                        background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                        marginBottom: '0.75rem',
                        boxShadow: `0 0 8px ${colors.glow}60`,
                      }} />
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700 }}>
                        {v?.category}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {v?.items?.map((skill: string, si: number) => (
                        <span key={skill} className="tag" style={{ transitionDelay: `${si * 0.03}s` }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Per-category badges */}
                    <BadgeRow section={sectionKey} />
                  </div>
                )
              })
            )}
          </div>

          {/* Global skills section badges (text + certification images) */}
          <GlobalSkillsBadges />
        </div>
      </section>
    </>
  )
}
