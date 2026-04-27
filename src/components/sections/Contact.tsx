'use client'
import { usePortfolio } from '@/hooks/usePortfolio'

export function Contact() {
  const { getValue } = usePortfolio('contact')
  const contact = getValue('main') as {
    heading?: string; subtext?: string; email?: string;
    phone?: string; linkedin?: string; github?: string
  } | null

  const links = [
    { label: 'Email', value: contact?.email, href: `mailto:${contact?.email}`, icon: '✉', color: '#ff6b6b' },
    { label: 'Phone', value: contact?.phone, href: `tel:${contact?.phone}`, icon: '◉', color: '#6bcb77' },
    { label: 'LinkedIn', value: 'linkedin.com/in/pradeepganesamoorthy', href: contact?.linkedin, icon: 'LI', color: '#4d96ff' },
  ]

  return (
    <section id="contact" className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Big aurora glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(199,125,255,0.12) 0%, rgba(77,150,255,0.08) 50%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '640px' }}>
          <span className="section-label">Contact</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem', marginBottom: '1rem' }}>
            {contact?.heading || <span className="gradient-text">Let's work together</span>}
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--fg-muted)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            {contact?.subtext || 'Open to Data Engineer, ETL Developer, and Cloud Data Engineering roles across India.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
            {links.map(item => item.value && (
              <a
                key={item.label}
                href={item.href}
                target={item.label === 'LinkedIn' ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  textDecoration: 'none', color: 'var(--fg)',
                  transition: 'all 0.25s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = item.color + '50'
                  el.style.background = `linear-gradient(135deg, var(--bg-card), ${item.color}08)`
                  el.style.transform = 'translateX(6px)'
                  el.style.boxShadow = `0 4px 20px ${item.color}20`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--border)'
                  el.style.background = 'var(--bg-card)'
                  el.style.transform = 'translateX(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                <span style={{
                  color: item.color,
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                  width: '28px', height: '28px',
                  background: `${item.color}15`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 10px ${item.color}30`,
                }}>
                  {item.icon}
                </span>
                <div>
                  <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', marginBottom: '0.1rem', letterSpacing: '0.08em' }}>
                    {item.label.toUpperCase()}
                  </p>
                  <p style={{ fontSize: '0.93rem' }}>{item.value}</p>
                </div>
                <span style={{ marginLeft: 'auto', color: item.color, fontSize: '1.1rem', opacity: 0.7 }}>→</span>
              </a>
            ))}
          </div>

          <a href="/api/resume/download" className="btn btn-warm" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Download Resume ↓
          </a>
        </div>
      </div>
    </section>
  )
}
