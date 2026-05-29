'use client'
import { useState, useEffect } from 'react'

interface Repo {
  id: number; name: string; description: string | null;
  url: string; language: string | null; stars: number;
  updatedAt: string; fork: boolean;
}

const LANG_COLORS: Record<string, string> = {
  Python: '#3776ab', JavaScript: '#f7df1e', TypeScript: '#3178c6',
  SQL: '#e38c00', Shell: '#89e051', HTML: '#e34c26', Java: '#b07219',
}

const CARD_ACCENTS = ['#ff6b6b', 'var(--theme-secondary,#237a57)', '#6bcb77', 'var(--theme-primary,#3ddc97)', '#ffd93d', '#ff9a3c']

export function GitHub() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/github/repos')
      .then(r => r.json())
      .then(d => { if (d.repos) { setRepos(d.repos); setUsername(d.username || '') } else setError(d.error || '') })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && !repos.length && !username) {
    return (
      <section id="github" className="section-pad" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Open source</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>GitHub Repositories</h2>
          <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            Set your GitHub username in Admin → GitHub tab to show repos here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="github" className="section-pad" style={{ background: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(35,122,87,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-label">Open source</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>GitHub repositories</h2>
          </div>
          {username && (
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
              @{username} ↗
            </a>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card" style={{ height: '130px' }} />
            ))}
          </div>
        ) : error ? (
          <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{error}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {repos.map((repo, idx) => {
              const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length]
              return (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem', minHeight: '130px', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Accent corner */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '3px', height: '100%',
                    background: `linear-gradient(to bottom, ${accent}, transparent)`,
                    opacity: 0.6,
                    transition: 'opacity 0.25s',
                  }} />
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '0.88rem', marginBottom: '0.35rem', color: accent }}>
                      {repo.name}
                    </p>
                    {repo.description && (
                      <p style={{ fontSize: '0.83rem', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
                        {repo.description.slice(0, 90)}{repo.description.length > 90 ? '…' : ''}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {repo.language && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--fg-muted)' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: LANG_COLORS[repo.language] || accent, display: 'inline-block', boxShadow: `0 0 5px ${LANG_COLORS[repo.language] || accent}80` }} />
                        {repo.language}
                      </span>
                    )}
                    {repo.stars > 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#ffd93d' }}>★ {repo.stars}</span>
                    )}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginLeft: 'auto' }}>
                      {new Date(repo.updatedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
