'use client'
import { useEffect, useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/3d/Scene').then(m => m.Scene), { ssr: false })

export function Hero() {
  const { getValue } = usePortfolio('hero')
  const [visible, setVisible] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [charIndex, setCharIndex] = useState(0)
  const [introVideo, setIntroVideo] = useState<{ youtubeId: string; title: string } | null>(null)
  const [showVideo, setShowVideo] = useState(true)
  const tagline = 'Data Engineer · ETL · BigQuery · Python · GCP'

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (charIndex < tagline.length) {
      const t = setTimeout(() => setCharIndex(i => i + 1), 38)
      return () => clearTimeout(t)
    }
  }, [charIndex, tagline.length])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useEffect(() => {
    fetch('/api/videos?type=intro&published=true')
      .then(r => r.json())
      .then(d => {
        if (d.videos && d.videos.length > 0) {
          setIntroVideo({ youtubeId: d.videos[0].youtubeId, title: d.videos[0].title })
        }
      })
      .catch(() => {})
  }, [])

  const hero = getValue('main') as {
    name?: string
    title?: string
    tagline?: string
    ctaText?: string
    ctaSecondary?: string
  } | null

  const firstName = hero?.name?.split(' ')[0] || 'Pradeep'
  const lastName = hero?.name?.split(' ').slice(1).join(' ') || 'Ganesamoorthy'

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <Scene />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div style={{
          position: 'absolute',
          top: '-10%', right: '-5%',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(199,125,255,0.18) 0%, transparent 70%)',
          animation: 'glowPulse 6s ease-in-out infinite',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%', left: '-10%',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77,150,255,0.15) 0%, transparent 70%)',
          animation: 'glowPulse 8s ease-in-out infinite 2s',
          filter: 'blur(50px)',
        }} />
      </div>

      <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

      {introVideo && showVideo && (
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          zIndex: 100,
          width: 'clamp(240px, 25vw, 360px)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: '2px solid rgba(199,125,255,0.3)',
        }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
            <iframe
              src={`https://www.youtube.com/embed/${introVideo.youtubeId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${introVideo.youtubeId}`}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                border: 'none',
              }}
              allow="autoplay; encrypted-media"
              title={introVideo.title}
            />
          </div>
          
          <button
            onClick={() => setShowVideo(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              zIndex: 10,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {introVideo && !showVideo && (
        <button
          onClick={() => setShowVideo(true)}
          className="btn btn-warm"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          ▶ Watch Introduction
        </button>
      )}

      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '200px',
        background: 'linear-gradient(to bottom, transparent, var(--bg))',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 3, paddingTop: '8rem', paddingBottom: '6rem' }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -5}px)`,
          transition: 'opacity 1.2s ease, transform 0.15s linear',
          maxWidth: '860px',
        }}>
          <div style={{ marginBottom: '2rem', animation: visible ? 'fadeUp 0.8s ease both' : 'none' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, rgba(199,125,255,0.15), rgba(77,150,255,0.15))',
              border: '1px solid rgba(199,125,255,0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              color: '#c77dff',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6bcb77', display: 'inline-block', boxShadow: '0 0 6px #6bcb77' }} />
              AVAILABLE FOR HIRE
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            marginBottom: '0.5rem',
            lineHeight: 1,
            animation: visible ? 'fadeUp 0.8s ease 0.1s both' : 'none',
          }}>
            {firstName}
          </h1>
          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            marginBottom: '1.5rem',
            lineHeight: 1,
            animation: visible ? 'fadeUp 0.8s ease 0.2s both' : 'none',
          }}>
            <span className="gradient-text">{lastName}</span>
          </h1>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            color: 'var(--fg-muted)',
            marginBottom: '1.5rem',
            letterSpacing: '0.04em',
            minHeight: '1.5rem',
            animation: visible ? 'fadeUp 0.8s ease 0.3s both' : 'none',
          }}>
            {tagline.slice(0, charIndex)}
            <span style={{ borderRight: '2px solid var(--accent-warm)', marginLeft: '1px', animation: 'glowPulse 1s step-end infinite' }}>&nbsp;</span>
          </div>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--fg-muted)',
            maxWidth: '580px',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
            animation: visible ? 'fadeUp 0.8s ease 0.4s both' : 'none',
          }}>
            {hero?.tagline || 'Building enterprise-scale data pipelines, migrating massive systems, and delivering 25% resilience improvements at PayPal/TCS.'}
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            animation: visible ? 'fadeUp 0.8s ease 0.5s both' : 'none',
          }}>
            <a href="#projects" className="btn btn-primary">
              View My Work <span style={{ opacity: 0.7 }}>↓</span>
            </a>
            <a href="/api/resume/download" className="btn btn-outline">
              Download Resume <span style={{ fontSize: '0.85em' }}>↗</span>
            </a>
          </div>

          <div style={{
            display: 'flex',
            gap: '2.5rem',
            marginTop: '3.5rem',
            flexWrap: 'wrap',
            animation: visible ? 'fadeUp 0.8s ease 0.6s both' : 'none',
          }}>
            {[
              { value: '6+', label: 'Years', color: '#ff6b6b' },
              { value: '3', label: 'Companies', color: '#ffd93d' },
              { value: '6', label: 'Awards', color: '#6bcb77' },
              { value: '40%', label: 'Speed gain', color: '#c77dff' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                  textShadow: `0 0 20px ${stat.color}60`,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fg-subtle)', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
                  {stat.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 4,
        animation: visible ? 'fadeUp 1s ease 1s both' : 'none',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--fg-subtle)', letterSpacing: '0.15em' }}>SCROLL</span>
        <div style={{ width: '18px', height: '30px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
          <div style={{ width: '3px', height: '8px', borderRadius: '2px', background: 'var(--accent-warm)', animation: 'float 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  )
}
