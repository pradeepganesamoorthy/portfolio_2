'use client'
import { useEffect, useState, useRef } from 'react'

interface Video {
  id: string
  title: string
  description: string
  youtubeId: string
  projectName: string
  order: number
  showInGallery: boolean
}

export function ProjectVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showSection, setShowSection] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadVideos = async () => {
      try {
        // Fetch video config
        const configRes = await fetch('/api/videos/config', { signal: controller.signal })
        if (configRes.ok) {
          const configData = await configRes.json()
          setShowSection(configData.config?.showVideoSection !== false)
        }

        // Fetch videos
        const res = await fetch('/api/videos?type=project&published=true', { signal: controller.signal })
        if (!res.ok) {
          setLoading(false)
          return
        }

        const data = await res.json()
        // Filter only videos with showInGallery = true
        const galleryVideos = (data.videos || []).filter((v: Video) => v.showInGallery)
        setVideos(galleryVideos)
        setLoading(false)
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error('Error loading videos:', error)
        }
        setLoading(false)
      }
    }

    loadVideos()
    return () => controller.abort()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Don't show section if disabled or no videos
  if (!showSection || videos.length === 0 || loading) {
    return null
  }

  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c']

  return (
    <section
      id="project-videos"
      className="section-pad"
      style={{
        background: 'var(--bg-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span className="section-label">Video Showcase</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>
              Project Walkthroughs
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => scroll('left')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-warm)'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-warm)'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '1rem',
          }}
          className="hide-scrollbar"
        >
          {videos.map((video, idx) => {
            const color = colors[idx % colors.length]
            
            return (
              <div
                key={video.id}
                className="card"
                style={{
                  minWidth: 'clamp(280px, 40vw, 400px)',
                  maxWidth: '400px',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${color}, ${colors[(idx + 1) % colors.length]})`,
                }} />

                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  marginBottom: '1rem',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-subtle)',
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%', height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>

                {video.projectName && (
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '100px',
                    background: `${color}15`,
                    border: `1px solid ${color}40`,
                    color: color,
                    marginBottom: '0.75rem',
                    letterSpacing: '0.05em',
                  }}>
                    {video.projectName}
                  </span>
                )}

                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--fg)',
                }}>
                  {video.title}
                </h3>

                {video.description && (
                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--fg-muted)',
                    lineHeight: 1.6,
                  }}>
                    {video.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
