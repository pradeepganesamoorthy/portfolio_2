'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface PortfolioItem {
  id: string
  section: string
  key: string
  value: unknown
  visible: boolean
  order: number
  isDraft: boolean
  publishedAt: string | null
  updatedAt: string
}

function AdminDashboard() {
  const { admin, logout, isLoading } = useAdmin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [activeSection, setActiveSection] = useState('hero')
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [lastPublished, setLastPublished] = useState<string | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [credMsg, setCredMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'content'|'github'|'resume'|'images'|'settings'>('content')
  const [githubUsername, setGithubUsername] = useState('')
  const [githubSaved, setGithubSaved] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUploading, setResumeUploading] = useState(false)
  const [resumeMsg, setResumeMsg] = useState('')
  const [parsedData, setParsedData] = useState<Record<string, unknown> | null>(null)
  
  // Image upload states
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImageUploading, setProfileImageUploading] = useState(false)
  const [profileImageMsg, setProfileImageMsg] = useState('')
  const [currentProfileImage, setCurrentProfileImage] = useState<string>('')

  // Add new section states
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [newItemKey, setNewItemKey] = useState('')
  const [newItemValue, setNewItemValue] = useState('{}')

  const forceChange = searchParams.get('changeCredentials') === '1'
  const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact', 'awards']

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/portfolio/sections')
    const data = await res.json()
    setItems(data.items || [])
  }, [])

  useEffect(() => {
    if (!isLoading && !admin) router.push('/')
  }, [admin, isLoading, router])

  useEffect(() => {
    if (admin) {
      fetchItems()
      if (forceChange || admin.isDefault) setShowCredentials(true)
      
      // Fetch current profile image
      fetch('/api/portfolio/sections?section=about')
        .then(r => r.json())
        .then(d => {
          const aboutItem = d.items?.find((i: PortfolioItem) => i.key === 'main')
          if (aboutItem) {
            const val = aboutItem.value as { profileImage?: string }
            setCurrentProfileImage(val.profileImage || '')
          }
        })
    }
  }, [admin, forceChange, fetchItems])

  useEffect(() => {
    fetch('/api/github/config')
      .then(r => r.json())
      .then(d => d.config?.username && setGithubUsername(d.config.username))
  }, [])

  const sectionItems = items.filter(i => i.section === activeSection)

  const startEdit = (item: PortfolioItem) => {
    setEditing(item)
    setEditValue(JSON.stringify(item.value, null, 2))
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const parsed = JSON.parse(editValue)
      await fetch('/api/portfolio/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, value: parsed }),
      })
      setEditing(null)
      await fetchItems()
    } catch { alert('Invalid JSON') }
    finally { setSaving(false) }
  }

  const toggleVisible = async (item: PortfolioItem) => {
    await fetch('/api/portfolio/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, visible: !item.visible }),
    })
    fetchItems()
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item permanently?')) return
    await fetch(`/api/portfolio/sections?id=${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const publishAll = async () => {
    setPublishing(true)
    const res = await fetch('/api/portfolio/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publishAll: true }),
    })
    const data = await res.json()
    setLastPublished(new Date(data.publishedAt).toLocaleString())
    setPublishing(false)
  }

  const saveCredentials = async () => {
    const res = await fetch('/api/auth/change-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    })
    const data = await res.json()
    if (data.success) {
      setCredMsg('Credentials updated! Please log in again.')
      setTimeout(() => { logout(); router.push('/') }, 2000)
    } else {
      setCredMsg(data.error || 'Error')
    }
  }

  const saveGithub = async () => {
    await fetch('/api/github/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: githubUsername, sortBy: 'updated' }),
    })
    setGithubSaved(true)
    setTimeout(() => setGithubSaved(false), 2000)
  }

  const uploadResume = async () => {
    if (!resumeFile) return
    setResumeUploading(true)
    const fd = new FormData()
    fd.append('file', resumeFile)
    const res = await fetch('/api/resume/parse', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.parsed) {
      setParsedData(data.parsed)
      setResumeMsg('Resume parsed! Review extracted data below.')
    } else {
      setResumeMsg('Upload failed.')
    }
    setResumeUploading(false)
  }

  const uploadResumeFile = async () => {
    if (!resumeFile) return
    const fd = new FormData()
    fd.append('file', resumeFile)
    const res = await fetch('/api/resume/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) {
      setResumeMsg('Resume uploaded and published! Download button now points to this file.')
    } else {
      setResumeMsg('Upload failed.')
    }
  }

  const uploadProfileImage = async () => {
    if (!profileImageFile) return
    setProfileImageUploading(true)
    const fd = new FormData()
    fd.append('file', profileImageFile)
    const res = await fetch('/api/upload/profile', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) {
      setCurrentProfileImage(data.path)
      setProfileImageMsg('Profile image uploaded! Click Publish All to make it live.')
      await fetchItems()
    } else {
      setProfileImageMsg('Upload failed.')
    }
    setProfileImageUploading(false)
  }

  const addNewItem = async () => {
    if (!newSectionName || !newItemKey) {
      alert('Section and key are required')
      return
    }
    try {
      const parsed = JSON.parse(newItemValue)
      await fetch('/api/portfolio/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: newSectionName,
          key: newItemKey,
          value: parsed,
          order: sectionItems.length,
        }),
      })
      setShowAddModal(false)
      setNewSectionName('')
      setNewItemKey('')
      setNewItemValue('{}')
      await fetchItems()
    } catch {
      alert('Invalid JSON in value field')
    }
  }

  if (isLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Loading...</p>
    </div>
  }

  const styles = {
    wrap: { minHeight: '100vh', background: 'var(--bg)', display: 'flex' as const },
    sidebar: {
      width: '220px', background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
      display: 'flex' as const, flexDirection: 'column' as const, padding: '1.5rem 0', flexShrink: 0 as const,
    },
    main: { flex: 1, padding: '2rem', overflowY: 'auto' as const, maxWidth: '1200px' },
    sideBtn: (active: boolean) => ({
      padding: '0.6rem 1.25rem',
      background: active ? 'var(--bg-subtle)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.78rem',
      color: active ? 'var(--fg)' : 'var(--fg-muted)',
      textAlign: 'left' as const,
      letterSpacing: '0.04em',
      transition: 'all 0.15s',
      borderLeft: active ? '2px solid var(--accent-warm)' : '2px solid transparent',
    }),
    itemCard: {
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '0.75rem',
    },
  }

  return (
    <div style={styles.wrap}>
      <aside style={styles.sidebar}>
        <div style={{ padding: '0 1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
          <span style={{ color: 'var(--accent-warm)' }}>P</span>G Admin
        </div>

        {(['content', 'github', 'resume', 'images', 'settings'] as const).map(tab => (
          <button key={tab} style={styles.sideBtn(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="/" target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--fg-subtle)', textDecoration: 'none' }}>
            ↗ view site
          </a>
          <button
            onClick={() => { logout(); router.push('/') }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--fg-subtle)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        {/* Credential change modal */}
        {(showCredentials || forceChange) && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          }}>
            <div className="card" style={{ maxWidth: '420px', width: '100%', background: 'var(--bg-card)', padding: '2rem' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>Change your credentials</h2>
              <p style={{ color: 'var(--fg-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                {forceChange ? 'You are using default credentials. Please change them now.' : 'Update your admin credentials.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <div><label>New username</label><input value={newUsername} onChange={e => setNewUsername(e.target.value)} /></div>
                <div><label>New password (min 6 chars)</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div>
              </div>
              {credMsg && <p style={{ color: 'var(--accent-warm)', fontSize: '0.85rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>{credMsg}</p>}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={saveCredentials} className="btn btn-warm" style={{ flex: 1 }}>Save credentials</button>
                {!forceChange && <button onClick={() => setShowCredentials(false)} className="btn btn-outline">Cancel</button>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Content Manager</h1>
                {lastPublished && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-subtle)' }}>Last published: {lastPublished}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setShowAddModal(true)} className="btn btn-outline">+ Add New Item</button>
                <button onClick={publishAll} disabled={publishing} className="btn btn-warm">
                  {publishing ? 'Publishing...' : 'Publish All'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {sections.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  style={{
                    padding: '0.35rem 0.875rem',
                    borderRadius: '100px',
                    border: `1px solid ${activeSection === s ? 'var(--accent-warm)' : 'var(--border)'}`,
                    background: activeSection === s ? 'var(--accent-warm)' : 'var(--bg-subtle)',
                    color: activeSection === s ? 'white' : 'var(--fg-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {sectionItems.length === 0 ? (
              <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                No items in this section yet. Click "+ Add New Item" to create one.
              </p>
            ) : (
              sectionItems.map(item => (
                <div key={item.id} style={styles.itemCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-warm)' }}>
                        {item.section}/{item.key}
                      </span>
                      {item.isDraft && <span style={{ marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#e07840', background: '#e0784020', padding: '0.1rem 0.5rem', borderRadius: '100px' }}>draft</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => toggleVisible(item)}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        {item.visible ? 'visible' : 'hidden'}
                      </button>
                      <button
                        onClick={() => startEdit(item)}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: '#e24b4a' }}
                      >
                        del
                      </button>
                    </div>
                  </div>
                  <pre style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-muted)',
                    background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                    overflow: 'auto', maxHeight: '120px',
                  }}>
                    {JSON.stringify(item.value, null, 2).slice(0, 400)}
                  </pre>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'images' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Profile Image</h1>
            
            {currentProfileImage && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '0.75rem' }}>Current profile image:</p>
                <img src={currentProfileImage} alt="Current profile" style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--accent-warm)' }} />
              </div>
            )}

            <div className="card" style={{ background: 'var(--bg-card)', padding: '1.75rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Upload New Profile Picture</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>Recommended: Square image, 500x500px, JPG or PNG</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => setProfileImageFile(e.target.files?.[0] || null)}
                style={{ marginBottom: '1rem' }}
              />
              {profileImageFile && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>
                  Selected: {profileImageFile.name}
                </p>
              )}
              <button onClick={uploadProfileImage} disabled={!profileImageFile || profileImageUploading} className="btn btn-warm">
                {profileImageUploading ? 'Uploading...' : 'Upload Image'}
              </button>
              {profileImageMsg && (
                <p style={{ color: 'var(--accent-warm)', fontSize: '0.85rem', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
                  {profileImageMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'github' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>GitHub Integration</h1>
            <div className="card" style={{ background: 'var(--bg-card)', padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label>GitHub Username</label>
                <input
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  placeholder="e.g. pradeepganesh"
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '1.25rem' }}>
                Public repositories will be fetched automatically and shown on the portfolio. Repos update every 5 minutes.
              </p>
              <button onClick={saveGithub} className="btn btn-warm">
                {githubSaved ? 'Saved!' : 'Save GitHub Settings'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div style={{ maxWidth: '640px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Resume Management</h1>
            
            <div className="card" style={{ background: 'var(--bg-card)', padding: '1.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Upload & Replace Resume File</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>
                This replaces the downloadable resume file on your portfolio. The download button will point to this new file.
              </p>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={e => setResumeFile(e.target.files?.[0] || null)}
                style={{ marginBottom: '1rem' }}
              />
              {resumeFile && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>
                  Selected: {resumeFile.name}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={uploadResumeFile} disabled={!resumeFile} className="btn btn-warm">
                  Upload & Publish Resume
                </button>
                <button onClick={uploadResume} disabled={!resumeFile || resumeUploading} className="btn btn-outline">
                  {resumeUploading ? 'Parsing...' : 'Parse Resume Data'}
                </button>
              </div>
              {resumeMsg && (
                <p style={{ color: 'var(--accent-warm)', fontSize: '0.85rem', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
                  {resumeMsg}
                </p>
              )}
            </div>

            {parsedData && (
              <div className="card" style={{ background: 'var(--bg-card)', padding: '1.75rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Parsed Data Preview</h3>
                <pre style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-muted)',
                  background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)',
                  overflow: 'auto', maxHeight: '300px',
                }}>
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
                <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginTop: '1rem' }}>
                  Review the extracted data above. Go to Content tab to manually update sections with this information.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '500px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Settings</h1>
            <div className="card" style={{ background: 'var(--bg-card)', padding: '1.75rem' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Change Credentials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <div><label>New Username</label><input value={newUsername} onChange={e => setNewUsername(e.target.value)} /></div>
                <div><label>New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div>
              </div>
              {credMsg && <p style={{ color: 'var(--accent-warm)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{credMsg}</p>}
              <button onClick={saveCredentials} className="btn btn-warm">Update Credentials</button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editing && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          }}>
            <div className="card" style={{ maxWidth: '700px', width: '100%', background: 'var(--bg-card)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '0.25rem' }}>Edit: {editing.section}/{editing.key}</h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-subtle)', marginBottom: '1.25rem' }}>
                Edit JSON value
              </p>
              <textarea
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{ height: '320px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', resize: 'vertical', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={saveEdit} disabled={saving} className="btn btn-warm" style={{ flex: 1 }}>
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button onClick={() => setEditing(null)} className="btn btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Item Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', background: 'var(--bg-card)', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Add New Item</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label>Section (e.g., education, experience)</label>
                  <input value={newSectionName} onChange={e => setNewSectionName(e.target.value)} placeholder="education" />
                </div>
                <div>
                  <label>Item Key (unique ID, e.g., high_school)</label>
                  <input value={newItemKey} onChange={e => setNewItemKey(e.target.value)} placeholder="high_school" />
                </div>
                <div>
                  <label>Value (JSON format)</label>
                  <textarea
                    value={newItemValue}
                    onChange={e => setNewItemValue(e.target.value)}
                    style={{ height: '200px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
                    placeholder={'{\n  "degree": "Higher Secondary",\n  "institution": "School Name",\n  "year": "2012"\n}'}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={addNewItem} className="btn btn-warm" style={{ flex: 1 }}>Add Item</button>
                <button onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Loading...</p>
    </div>}>
      <AdminDashboard />
    </Suspense>
  )
}
