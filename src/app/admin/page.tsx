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
  const [activeTab, setActiveTab] = useState<'content'|'github'|'resume'|'images'|'videos'|'theme'|'animation'|'badges'|'settings'>('content')
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

  // Video states
  const [videos, setVideos] = useState<any[]>([])
  const [videoType, setVideoType] = useState<'intro' | 'project'>('project')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState('')
  const [videoProjectName, setVideoProjectName] = useState('')
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoMsg, setVideoMsg] = useState('')
  const [editingVideo, setEditingVideo] = useState<any>(null)

  // ── THEME STATE ──────────────────────────────────────────────────────────────
  const [themeConfig, setThemeConfig] = useState({
    primaryColor: '#c77dff', secondaryColor: '#4d96ff', accentColor: '#ff6b6b',
    navbarBgColor: 'rgba(0,0,0,0.8)', textColor: '', hoverColor: '#ffd93d',
    themePreset: 'custom', sectionFontColors: '{}',
  })
  const [themeSaving, setThemeSaving] = useState(false)
  const [themeMsg, setThemeMsg] = useState('')
  const [themePreviewActive, setThemePreviewActive] = useState(false)

  const SECTIONS_FOR_FONT = [
    {id:'hero',label:'🦸 Hero'},{id:'about',label:'👤 About'},
    {id:'skills',label:'🛠 Skills'},{id:'experience',label:'💼 Experience'},
    {id:'projects',label:'🚀 Projects'},{id:'github',label:'🐙 GitHub'},
    {id:'contact',label:'📬 Contact'},
  ]
  const getSFC = (): Record<string,string> => {
    try { return JSON.parse(themeConfig.sectionFontColors||'{}') } catch { return {} }
  }
  const setSFC = (sectionId: string, color: string) => {
    const cur = getSFC()
    if (color && color !== '') cur[sectionId] = color; else delete cur[sectionId]
    setThemeConfig(prev => ({ ...prev, sectionFontColors: JSON.stringify(cur) }))
  }

  const THEME_PRESETS: Record<string, { label: string; primary: string; secondary: string; accent: string; hover: string; navbar: string }> = {
    emerald:     { label: '🌿 Emerald Forest', primary: '#3ddc97', secondary: '#237a57', accent: '#6ee7b7', hover: '#a7f3d0', navbar: 'rgba(7,33,28,0.92)' },
    custom:      { label: '✏️ Custom',         primary: '#c77dff', secondary: '#4d96ff', accent: '#ff6b6b', hover: '#ffd93d', navbar: 'rgba(0,0,0,0.85)' },
    ocean:       { label: '🌊 Ocean Blue',      primary: '#0096c7', secondary: '#00b4d8', accent: '#48cae4', hover: '#90e0ef', navbar: 'rgba(0,10,20,0.88)' },
    sunset:      { label: '🌅 Sunset',          primary: '#f4845f', secondary: '#f7b267', accent: '#f25c54', hover: '#ffd166', navbar: 'rgba(20,5,0,0.88)' },
    forest:      { label: '🌿 Forest',          primary: '#40916c', secondary: '#52b788', accent: '#74c69d', hover: '#b7e4c7', navbar: 'rgba(0,12,5,0.88)' },
    neon:        { label: '💜 Neon Purple',     primary: '#9d4edd', secondary: '#c77dff', accent: '#e0aaff', hover: '#7b2ff7', navbar: 'rgba(8,0,18,0.9)' },
    monochrome:  { label: '⚫ Monochrome',      primary: '#aaaaaa', secondary: '#888888', accent: '#ffffff', hover: '#cccccc', navbar: 'rgba(10,10,10,0.9)' },
    rose:        { label: '🌸 Rose Gold',       primary: '#e9a8a8', secondary: '#c9a0a0', accent: '#f5c2c7', hover: '#ffb3c1', navbar: 'rgba(20,5,8,0.88)' },
    cyberpunk:   { label: '⚡ Cyberpunk',       primary: '#f5ff00', secondary: '#ff00a0', accent: '#00fff5', hover: '#ff8c00', navbar: 'rgba(5,0,15,0.92)' },
    dataeng:     { label: '📊 Data Engineer',   primary: '#4d96ff', secondary: '#6bcb77', accent: '#ffd93d', hover: '#ff9a3c', navbar: 'rgba(0,5,18,0.9)' },
    midnight:    { label: '🌙 Midnight',        primary: '#7b68ee', secondary: '#483d8b', accent: '#9370db', hover: '#ba55d3', navbar: 'rgba(2,2,8,0.95)' },
  }

  const applyPreset = (key: string) => {
    const p = THEME_PRESETS[key]
    if (!p) return
    const next = { ...themeConfig, themePreset: key, primaryColor: p.primary, secondaryColor: p.secondary, accentColor: p.accent, hoverColor: p.hover, navbarBgColor: p.navbar }
    setThemeConfig(next)
    return next
  }

  // Apply theme instantly on this page (admin preview)
  const applyLocal = (cfg: typeof themeConfig) => {
    const r = document.documentElement
    r.style.setProperty('--theme-primary',   cfg.primaryColor)
    r.style.setProperty('--theme-secondary', cfg.secondaryColor)
    r.style.setProperty('--theme-accent',    cfg.accentColor)
    r.style.setProperty('--theme-hover',     cfg.hoverColor)
    r.style.setProperty('--theme-navbar-bg', cfg.navbarBgColor)
    r.style.setProperty('--accent-warm',     cfg.primaryColor)
    r.style.setProperty('--accent-cool',     cfg.secondaryColor)
  }

  // Preview = save to DB immediately; ThemeColorProvider polls every 2s → site updates automatically
  const previewTheme = async (cfg = themeConfig) => {
    applyLocal(cfg)                       // instant on this admin page
    setThemePreviewActive(true)
    setThemeMsg('⏳ Saving preview to site…')
    const d = await fetch('/api/theme', {
      method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(cfg)
    }).then(r=>r.json())
    setThemeMsg(d.success
      ? '👁 Preview live! Open localhost:3000 — updates in ~2 s. Click Publish when happy.'
      : '❌ Preview save failed')
  }

  const saveTheme = async () => {
    setThemeSaving(true)
    const res = await fetch('/api/theme', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(themeConfig),
    })
    const data = await res.json()
    setThemeMsg(data.success ? '✅ Theme published! Reload the site to see it.' : '❌ Save failed')
    setThemeSaving(false)
    setTimeout(() => setThemeMsg(''), 4000)
  }

  // ── ANIMATION STATE ──────────────────────────────────────────────────────────
  const [animConfig, setAnimConfig] = useState({ selectedAnimation: 'default', animationSpeed: 'normal', useThemeColors: true })
  const [animSaving, setAnimSaving] = useState(false)
  const [animMsg, setAnimMsg] = useState('')
  const [animPreviewActive, setAnimPreviewActive] = useState(false)

  const ANIMATIONS = [
    { id:'default',           emoji:'✨', name:'Particles & Torus',   desc:'Classic floating particles with spinning torus rings' },
    { id:'cosmic-ribbon',     emoji:'🌈', name:'Cosmic Ribbon',        desc:'⭐ Pro — twin ribbons of light spiralling through space' },
    { id:'gravity-well',      emoji:'🕳', name:'Gravity Well',         desc:'⭐ Pro — particles spiral into a glowing singularity' },
    { id:'crystal-lattice',   emoji:'💠', name:'Crystal Lattice',      desc:'⭐ Pro — pulsing 3-D crystal node grid with light beams' },
    { id:'plasma-field',      emoji:'⚡', name:'Plasma Field',          desc:'⭐ Pro — fluid plasma cloud that breathes and flows' },
    { id:'interstellar-dust', emoji:'🌌', name:'Interstellar Dust',    desc:'⭐ Pro — galaxy spiral arms with star dust and nebula' },
    { id:'morphing-geometry', emoji:'💎', name:'Morphing Geometry',    desc:'Crystal form morphs between shapes with orbit rings' },
    { id:'quantum-field',     emoji:'📊', name:'Quantum Data Field',   desc:'3-D live histogram bars pulse in wave patterns' },
    { id:'dna-double',        emoji:'🧬', name:'DNA Double Helix',     desc:'Elegant rotating double helix with cross-links' },
    { id:'data-flow-pipeline',emoji:'🔀', name:'Data Flow Pipeline',   desc:'ETL pipeline nodes with flowing data packets' },
    { id:'database-clusters', emoji:'🗄', name:'Database Clusters',    desc:'BigQuery, PostgreSQL, Redis stacks with query packets' },
    { id:'etl-stream',        emoji:'⚙', name:'ETL Stream',           desc:'Extract → Transform → Load with streaming particles' },
    { id:'neural-mesh',       emoji:'🧠', name:'Neural Mesh',          desc:'ML-style connected nodes with signal pulses' },
    { id:'data-vortex',       emoji:'🌀', name:'Data Vortex',          desc:'Swirling data tornado — high-throughput feel' },
    { id:'cloud-nodes',       emoji:'☁', name:'Cloud Architecture',   desc:'GCP/AWS zone nodes with inter-zone packets' },
    { id:'stream-processor',  emoji:'📨', name:'Stream Processor',     desc:'Kafka producers → brokers → consumers' },
    { id:'schema-graph',      emoji:'🗃', name:'Schema Graph',         desc:'ER diagram tables with FK connections' },
    { id:'bigquery-globe',    emoji:'🌐', name:'BigQuery Globe',       desc:'Globe with GCP datacenter nodes and query beams' },
    { id:'floating-orbs',     emoji:'🫧', name:'Floating Orbs',        desc:'Glowing theme-colored spheres in 3-D space' },
  ]

  // Preview animation = save to DB; Scene.tsx polls every 5s → switches automatically
  const DEFAULT_THEME = {
  primaryColor: '#c77dff',
  secondaryColor: '#4d96ff',
  accentColor: '#ff6b6b',
  navbarBgColor: 'rgba(0,0,0,0.8)',
  textColor: '',
  hoverColor: '#ffd93d',
  themePreset: 'custom',
  sectionFontColors: '{}',
}
  const DEFAULT_ANIM  = {selectedAnimation:'quantum-field',animationSpeed:'normal',useThemeColors:true}

  const resetTheme = async () => {
    setThemeConfig(DEFAULT_THEME); applyLocal(DEFAULT_THEME)
    const d = await fetch('/api/theme',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(DEFAULT_THEME)}).then(r=>r.json())
    setThemeMsg(d.success ? '↩️ Theme reset to default!' : '❌ Reset failed')
    setTimeout(()=>setThemeMsg(''),3000)
  }
  const resetAnimation = async () => {
    setAnimConfig(DEFAULT_ANIM)
    const d = await fetch('/api/animation',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(DEFAULT_ANIM)}).then(r=>r.json())
    setAnimMsg(d.success ? '↩️ Animation reset to default!' : '❌ Reset failed')
    setTimeout(()=>setAnimMsg(''),3000)
  }
  const resetBadges = async () => {
    if(!confirm('Delete ALL badges in section "'+badgeSection+'"?')) return
    const d = await fetch('/api/badges/reset?section='+badgeSection,{method:'DELETE'}).then(r=>r.json())
    setBadgeMsg(d.success ? '↩️ Badges cleared!' : '❌ Clear failed')
    fetchBadges(); setTimeout(()=>setBadgeMsg(''),3000)
  }

  const publishAllTheme = async () => {
    setThemeSaving(true); applyLocal(themeConfig)
    const d = await fetch('/api/theme',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(themeConfig)}).then(r=>r.json())
    setThemeMsg(d.success?'✅ Theme published & live!':'❌ Publish failed'); setThemeSaving(false); setTimeout(()=>setThemeMsg(''),4000)
  }

  const publishAllAnimation = async () => {
    setAnimSaving(true)
    const d = await fetch('/api/animation',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(animConfig)}).then(r=>r.json())
    setAnimMsg(d.success?'✅ Animation published & live!':'❌ Publish failed'); setAnimSaving(false); setTimeout(()=>setAnimMsg(''),4000)
  }

  const previewAnimation = async () => {
    setAnimPreviewActive(true)
    setAnimMsg('⏳ Saving animation preview…')
    const d = await fetch('/api/animation', {
      method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(animConfig)
    }).then(r=>r.json())
    setAnimMsg(d.success
      ? '👁 Preview live! Animation switches on localhost:3000 within 5 s. Publish when happy.'
      : '❌ Preview failed')
  }

  const saveAnimation = async () => {
    setAnimSaving(true)
    const res = await fetch('/api/animation', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(animConfig),
    })
    const data = await res.json()
    setAnimMsg(data.success ? '✅ Animation published!' : '❌ Save failed')
    setAnimSaving(false)
    setTimeout(() => setAnimMsg(''), 4000)
  }

  // ── BADGE STATE ──────────────────────────────────────────────────────────────
  const [badges, setBadges] = useState<any[]>([])
  const [badgeSection, setBadgeSection] = useState('skills')
  const [customBadgeName, setCustomBadgeName] = useState('')
  const [badgeColor, setBadgeColor] = useState('#4d96ff')
  const [badgeMsg, setBadgeMsg] = useState('')

  const BADGE_SECTIONS = ['skills', 'experience', 'projects', 'about', 'certifications', 'education']
  const PRESET_BADGES = [
    { group: 'Languages', items: ['Python','JavaScript','TypeScript','Java','Go','Rust','C++','C#','Swift','Kotlin','SQL','Scala'] },
    { group: 'Data Engineering', items: ['Apache Spark','Apache Kafka','Apache Airflow','DBT','Apache Beam','Flink','Hive','Presto','dbt','Trino'] },
    { group: 'Cloud & Infra', items: ['BigQuery','GCP','AWS','Azure','Docker','Kubernetes','Terraform','Dataflow','Pub/Sub','GCS','Redshift','Snowflake'] },
    { group: 'Frameworks', items: ['React','Next.js','FastAPI','Django','Node.js','Flask','Spring','Pandas','NumPy','Scikit-learn'] },
    { group: 'Databases', items: ['PostgreSQL','MySQL','MongoDB','Redis','Elasticsearch','SQLite','Cassandra','DynamoDB','Firestore','Bigtable'] },
    { group: 'Tools', items: ['Git','GitHub','Linux','Nginx','Grafana','Tableau','Looker','dbt Cloud','Fivetran','Airbyte','Great Expectations'] },
  ]

  const fetchBadges = async () => {
    const res = await fetch(`/api/badges?section=${badgeSection}`)
    const data = await res.json()
    setBadges(data.badges || [])
  }

  const addBadge = async (name: string) => {
    const res = await fetch('/api/badges', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: badgeSection, name, type: 'preset', iconName: name.toLowerCase(), color: badgeColor }),
    })
    const data = await res.json()
    if (data.success) {
      setBadgeMsg(`✅ "${name}" added to ${badgeSection}!`)
      fetchBadges()
    } else {
      setBadgeMsg('❌ ' + (data.error || 'Error'))
    }
    setTimeout(() => setBadgeMsg(''), 3000)
  }

  const deleteBadge = async (id: string) => {
    if (!confirm('Delete this badge?')) return
    await fetch(`/api/badges?id=${id}`, { method: 'DELETE' })
    fetchBadges()
  }

  const forceChange = searchParams.get('changeCredentials') === '1'
  const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact', 'awards']

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/portfolio/sections')
    const data = await res.json()
    setItems(data.items || [])
  }, [])

  // No instant redirect — show login form instead
  // (router.push('/') was causing the blank-page bug)

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

  // Fetch videos
  useEffect(() => {
    if (admin) {
      fetch('/api/videos')
        .then(r => r.json())
        .then(d => setVideos(d.videos || []))
    }
  }, [admin])

  // Fetch current theme & animation config on mount
  useEffect(() => {
    fetch('/api/theme').then(r=>r.json()).then(d=>{ if(d.theme) setThemeConfig({...d.theme, sectionFontColors: d.theme.sectionFontColors||'{}' }) })
    fetch('/api/animation').then(r => r.json()).then(d => { if (d.config) setAnimConfig(d.config) })
  }, [])

  // Fetch badges when section changes
  useEffect(() => { fetchBadges() }, [badgeSection])

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
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent-warm)' }}>P</span>G Admin
          </div>
          <p style={{ color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>Checking session…</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <AdminLoginForm />
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
      <aside className="pg-admin-sidebar" style={styles.sidebar}>
        <div style={{ padding: '0 1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
          <span style={{ color: 'var(--accent-warm)' }}>P</span>G Admin
        </div>

        {([
          { id: 'content',   label: '📝 Content' },
          { id: 'github',    label: '🐙 GitHub' },
          { id: 'resume',    label: '📄 Resume' },
          { id: 'images',    label: '🖼️ Images' },
          { id: 'videos',    label: '🎬 Videos' },
          { id: 'theme',     label: '🎨 Theme' },
          { id: 'animation', label: '✨ Animation' },
          { id: 'badges',    label: '🏷️ Badges' },
          { id: 'settings',  label: '⚙️ Settings' },
        ] as const).map(t => (
          <button key={t.id} style={styles.sideBtn(activeTab === t.id)} onClick={() => setActiveTab(t.id as any)}>
            {t.label}
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
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--fg)' }}>Profile Image</h1>
            
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

        {activeTab === 'videos' && (
          <div style={{ maxWidth: '900px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--fg)' }}>Video Management</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setVideoType('intro')}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${videoType === 'intro' ? 'var(--accent-warm)' : 'var(--border)'}`,
                  background: videoType === 'intro' ? 'var(--accent-warm)' : 'var(--bg-subtle)',
                  color: videoType === 'intro' ? 'white' : 'var(--fg)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              >
                Introduction Video
              </button>
              <button
                onClick={() => setVideoType('project')}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${videoType === 'project' ? 'var(--accent-warm)' : 'var(--border)'}`,
                  background: videoType === 'project' ? 'var(--accent-warm)' : 'var(--bg-subtle)',
                  color: videoType === 'project' ? 'white' : 'var(--fg)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              >
                Project Videos
              </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
                {editingVideo ? 'Edit Video' : `Add New ${videoType === 'intro' ? 'Introduction' : 'Project'} Video`}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label>YouTube URL *</label>
                  <input
                    value={videoYoutubeUrl}
                    onChange={e => setVideoYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--fg-subtle)', marginTop: '0.25rem' }}>
                    Paste the full YouTube URL. Works with youtube.com/watch or youtu.be links.
                  </p>
                </div>

                <div>
                  <label>Title *</label>
                  <input
                    value={videoTitle}
                    onChange={e => setVideoTitle(e.target.value)}
                    placeholder={videoType === 'intro' ? 'My Introduction' : 'Project Demo'}
                  />
                </div>

                {videoType === 'project' && (
                  <div>
                    <label>Project Name</label>
                    <input
                      value={videoProjectName}
                      onChange={e => setVideoProjectName(e.target.value)}
                      placeholder="ETL Pipeline Project"
                    />
                  </div>
                )}

                <div>
                  <label>Description</label>
                  <textarea
                    value={videoDescription}
                    onChange={e => setVideoDescription(e.target.value)}
                    placeholder="Brief description of the video content..."
                    style={{ minHeight: '100px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={async () => {
                      if (!videoYoutubeUrl || !videoTitle) {
                        setVideoMsg('YouTube URL and Title are required')
                        return
                      }

                      setVideoUploading(true)
                      setVideoMsg('')

                      const body: any = {
                        type: videoType,
                        title: videoTitle,
                        description: videoDescription,
                        youtubeUrl: videoYoutubeUrl,
                        projectName: videoProjectName,
                        order: videos.filter(v => v.type === videoType).length,
                      }

                      if (editingVideo) {
                        body.id = editingVideo.id
                      }

                      const res = await fetch('/api/videos', {
                        method: editingVideo ? 'PUT' : 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                      })

                      const data = await res.json()

                      if (data.success) {
                        setVideoMsg(editingVideo ? 'Video updated!' : 'Video added! Click Publish All to make it live.')
                        setVideoTitle('')
                        setVideoDescription('')
                        setVideoYoutubeUrl('')
                        setVideoProjectName('')
                        setEditingVideo(null)
                        fetch('/api/videos').then(r => r.json()).then(d => setVideos(d.videos || []))
                      } else {
                        setVideoMsg(data.error || 'Failed to save video')
                      }

                      setVideoUploading(false)
                    }}
                    disabled={videoUploading}
                    className="btn btn-warm"
                  >
                    {videoUploading ? 'Saving...' : editingVideo ? 'Update Video' : 'Add Video'}
                  </button>

                  {editingVideo && (
                    <button
                      onClick={() => {
                        setEditingVideo(null)
                        setVideoTitle('')
                        setVideoDescription('')
                        setVideoYoutubeUrl('')
                        setVideoProjectName('')
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {videoMsg && (
                  <p style={{ color: videoMsg.includes('Failed') ? '#e24b4a' : 'var(--accent-warm)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                    {videoMsg}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                {videoType === 'intro' ? 'Introduction Video' : 'Project Videos'} ({videos.filter((v: any) => v.type === videoType).length})
              </h3>

              {videos.filter((v: any) => v.type === videoType).length === 0 ? (
                <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  No {videoType} videos yet. Add one above.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {videos.filter((v: any) => v.type === videoType).map((video: any) => (
                    <div key={video.id} style={styles.itemCard}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '160px',
                          height: '90px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: 'var(--bg-subtle)',
                        }}>
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{video.title}</h4>
                              {video.projectName && (
                                <span style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.7rem',
                                  color: 'var(--accent-warm)',
                                }}>
                                  {video.projectName}
                                </span>
                              )}
                            </div>
                            {video.isDraft && (
                              <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.68rem',
                                color: '#e07840',
                                background: '#e0784020',
                                padding: '0.1rem 0.5rem',
                                borderRadius: '100px',
                              }}>
                                draft
                              </span>
                            )}
                          </div>

                          {video.description && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                              {video.description}
                            </p>
                          )}

                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                setEditingVideo(video)
                                setVideoTitle(video.title)
                                setVideoDescription(video.description || '')
                                setVideoYoutubeUrl(video.youtubeUrl)
                                setVideoProjectName(video.projectName || '')
                                setVideoType(video.type)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Delete this video?')) return
                                await fetch(`/api/videos?id=${video.id}`, { method: 'DELETE' })
                                fetch('/api/videos').then(r => r.json()).then(d => setVideos(d.videos || []))
                              }}
                              style={{
                                padding: '0.3rem 0.75rem',
                                fontSize: '0.75rem',
                                background: 'none',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                color: '#e24b4a',
                              }}
                            >
                              delete
                            </button>
                            <a
                              href={video.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              view on YouTube ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {videos.some((v: any) => v.isDraft) && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>
                  You have {videos.filter((v: any) => v.isDraft).length} draft video(s). Publish them to make them visible on the portfolio.
                </p>
                <button
                  onClick={async () => {
                    await fetch('/api/videos/publish', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ publishAll: true }),
                    })
                    fetch('/api/videos').then(r => r.json()).then(d => setVideos(d.videos || []))
                    setVideoMsg('All videos published!')
                  }}
                  className="btn btn-warm"
                >
                  Publish All Videos
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'github' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--fg)' }}>GitHub Integration</h1>
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
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--fg)' }}>Resume Management</h1>
            
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

        {/* ══════════════ THEME TAB ══════════════ */}
        {activeTab === 'theme' && (
          <div style={{ maxWidth: '760px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--fg)' }}>🎨 Theme Colors</h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--fg-subtle)', marginBottom: '2rem' }}>
              Click <strong>Preview</strong> to see changes live, then <strong>Publish</strong> to save to your site.
            </p>

            {/* Presets */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.88rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Presets</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(THEME_PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => {
                      const next = applyPreset(key)
                      if (next) previewTheme(next)
                    }}
                    style={{
                      padding: '0.45rem 0.9rem', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer',
                      border: themeConfig.themePreset === key ? '2px solid var(--accent-warm)' : '1px solid var(--border)',
                      background: themeConfig.themePreset === key ? 'var(--accent-warm)' : 'var(--bg-subtle)',
                      color: themeConfig.themePreset === key ? '#fff' : 'inherit',
                      fontFamily: 'var(--font-mono)', transition: 'all 0.2s',
                    }}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            {/* Color pickers */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.88rem', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Custom Colors</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {([
                  ['primaryColor',   'Primary Color',    'Links, badges, accents'],
                  ['secondaryColor', 'Secondary Color',  'Cards, secondary elements'],
                  ['accentColor',    'Accent / Glow',    'Gradient accent, glow effects'],
                  ['hoverColor',     'Hover Highlight',  'Nav hover, hover states'],
                  ['textColor',      'Text Color',       'Body text override'],
                  ['navbarBgColor',  'Navbar Background','e.g. rgba(0,0,0,0.8)'],
                ] as const).map(([key, label, hint]) => (
                  <div key={key}>
                    <label style={{ fontSize: '0.78rem', textTransform: 'none', letterSpacing: 0, color: 'var(--fg-muted)', marginBottom: '0.5rem', display: 'block' }}>
                      {label}<br /><span style={{ color: 'var(--fg-subtle)', fontSize: '0.68rem' }}>{hint}</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={(themeConfig as any)[key]?.match(/^#/) ? (themeConfig as any)[key] : '#000000'}
                        onChange={e => setThemeConfig(prev => ({ ...prev, [key]: e.target.value, themePreset: 'custom' }))}
                        style={{ width: '38px', height: '34px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                      />
                      <input
                        value={(themeConfig as any)[key] || ''}
                        onChange={e => setThemeConfig(prev => ({ ...prev, [key]: e.target.value, themePreset: 'custom' }))}
                        style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                        placeholder={key === 'navbarBgColor' ? 'rgba(0,0,0,0.85)' : '#ffffff'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-section font color pickers */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.88rem', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>
                Section Font Colors
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fg-subtle)', marginBottom: '1rem' }}>
                Override text color per section. Leave blank to use theme default.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {SECTIONS_FOR_FONT.map(sec => {
                  const current = getSFC()[sec.id] || ''
                  return (
                    <div key={sec.id}>
                      <label style={{ fontSize: '0.72rem', marginBottom: '0.3rem', textTransform: 'none', letterSpacing: 0 }}>{sec.label}</label>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={current || '#f0efe9'}
                          onChange={e => setSFC(sec.id, e.target.value)}
                          style={{ width: '34px', height: '30px', border: 'none', borderRadius: '4px', padding: 0, cursor: 'pointer', flexShrink: 0 }}
                        />
                        <input
                          value={current}
                          onChange={e => setSFC(sec.id, e.target.value)}
                          placeholder="e.g. #f0efe9"
                          style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                        />
                        {current && (
                          <button
                            onClick={() => setSFC(sec.id, '')}
                            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--fg-subtle)' }}
                          >✕</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Live preview swatch */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.88rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Color Preview</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  ['Primary', themeConfig.primaryColor],
                  ['Secondary', themeConfig.secondaryColor],
                  ['Accent', themeConfig.accentColor],
                  ['Hover', themeConfig.hoverColor],
                  ['Text', themeConfig.textColor],
                ].map(([name, col]) => (
                  <div key={name} style={{ textAlign: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: col, border: '1px solid var(--border)', marginBottom: '0.3rem', boxShadow: `0 0 10px ${col}50` }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--fg-subtle)' }}>{name}</span>
                  </div>
                ))}
                {/* Simulated button */}
                <div style={{ marginLeft: '0.5rem' }}>
                  <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: `linear-gradient(135deg, ${themeConfig.primaryColor}, ${themeConfig.accentColor})`, color: '#fff', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    Button preview
                  </div>
                </div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `1px solid ${themeConfig.primaryColor}`, color: themeConfig.primaryColor, fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                  Outline btn
                </div>
              </div>
            </div>

            {themeMsg && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-warm)', marginBottom: '1rem' }}>{themeMsg}</p>}
            {themePreviewActive && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-subtle)', marginBottom: '0.75rem' }}>✔ Preview applied to this admin panel. Publish to save globally.</p>}
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
              <button onClick={resetTheme} className="btn btn-outline" style={{fontSize:'0.8rem',padding:'0.55rem 1rem'}}>↩️ Reset</button>
              <button onClick={()=>previewTheme()} className="btn btn-outline" style={{flex:1}}>👁 Preview</button>
              <button onClick={saveTheme} disabled={themeSaving} className="btn btn-warm">{themeSaving?'Saving…':'Save'}</button>
              <button onClick={publishAllTheme} disabled={themeSaving} className="btn btn-warm" style={{flex:1,background:'linear-gradient(135deg,#6bcb77,#4d96ff)'}}>
                🚀 Publish All
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ ANIMATION TAB ══════════════ */}
        {activeTab === 'animation' && (
          <div style={{ maxWidth: '860px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--fg)' }}>✨ Hero Animation</h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--fg-subtle)', marginBottom: '2rem' }}>
              All animations are data-engineering themed. Click <strong>Preview</strong> to see it on your live site (open site in another tab), then <strong>Publish</strong>.
            </p>

            {/* Animation grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {ANIMATIONS.map(anim => (
                <div
                  key={anim.id}
                  onClick={() => setAnimConfig(prev => ({ ...prev, selectedAnimation: anim.id }))}
                  style={{
                    padding: '1.1rem', borderRadius: '10px', cursor: 'pointer',
                    border: animConfig.selectedAnimation === anim.id ? '2px solid var(--accent-warm)' : '1px solid var(--border)',
                    background: animConfig.selectedAnimation === anim.id ? 'rgba(200,96,42,0.1)' : 'var(--bg-card)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{anim.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>{anim.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--fg-subtle)', lineHeight: 1.4 }}>{anim.desc}</div>
                  {animConfig.selectedAnimation === anim.id && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--accent-warm)', fontFamily: 'var(--font-mono)' }}>✓ Selected</div>
                  )}
                </div>
              ))}
            </div>

            {/* Options */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.88rem', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Options</h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', textTransform: 'none', letterSpacing: 0, marginBottom: '0.4rem' }}>Speed</label>
                  <select
                    value={animConfig.animationSpeed}
                    onChange={e => setAnimConfig(prev => ({ ...prev, animationSpeed: e.target.value }))}
                    style={{ marginTop: '0.4rem', width: '140px' }}
                  >
                    <option value="slow">🐢 Slow</option>
                    <option value="normal">⚡ Normal</option>
                    <option value="fast">🚀 Fast</option>
                  </select>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.2rem' }}>
                  <input
                    type="checkbox"
                    checked={animConfig.useThemeColors}
                    onChange={e => setAnimConfig(prev => ({ ...prev, useThemeColors: e.target.checked }))}
                    style={{ width: 'auto' }}
                  />
                  <span style={{ fontSize: '0.84rem' }}>Adapt to theme colors</span>
                </label>
              </div>
            </div>

            {animMsg && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-warm)', marginBottom: '1rem' }}>{animMsg}</p>}
            {animPreviewActive && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-subtle)', marginBottom: '0.75rem' }}>✔ Preview active — open your site in another tab to see the animation.</p>}
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
              <button onClick={resetAnimation} className="btn btn-outline" style={{fontSize:'0.8rem',padding:'0.55rem 1rem'}}>↩️ Reset</button>
              <button onClick={previewAnimation} className="btn btn-outline" style={{flex:1}}>👁 Preview</button>
              <button onClick={saveAnimation} disabled={animSaving} className="btn btn-warm">{animSaving?'Saving…':'Save'}</button>
              <button onClick={publishAllAnimation} disabled={animSaving} className="btn btn-warm" style={{flex:1,background:'linear-gradient(135deg,#6bcb77,#4d96ff)'}}>
                🚀 Publish All
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ BADGES TAB ══════════════ */}
        {activeTab === 'badges' && (
          <div style={{ maxWidth: '760px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--fg)' }}>🏷️ Skill Badges</h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--fg-subtle)', marginBottom: '2rem' }}>
              Badges appear in the Skills section. If none added, the section stays hidden. Hover on the site = spin effect.
            </p>

            {/* Section + Color */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.88rem', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Section & Badge Color</h3>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <label style={{ fontSize: '0.78rem', textTransform: 'none' }}>Section</label>
                  <select value={badgeSection} onChange={e => setBadgeSection(e.target.value)} style={{ marginTop: '0.4rem' }}>
                    {BADGE_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', textTransform: 'none', display: 'block', marginBottom: '0.4rem' }}>Badge Color</label>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <input type="color" value={badgeColor} onChange={e => setBadgeColor(e.target.value)}
                      style={{ width: '38px', height: '34px', border: 'none', borderRadius: '6px', padding: 0, cursor: 'pointer' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: badgeColor }}>{badgeColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preset badges */}
            {PRESET_BADGES.map(group => (
              <div key={group.group} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '0.75rem' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: '0.75rem' }}>
                  {group.group}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {group.items.map(name => (
                    <button
                      key={name}
                      onClick={() => addBadge(name)}
                      style={{
                        padding: '0.2rem 0.6rem', fontSize: '0.76rem', borderRadius: '100px', cursor: 'pointer',
                        border: `1px solid ${badgeColor}50`, background: `${badgeColor}15`,
                        color: 'var(--fg)', fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${badgeColor}35` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${badgeColor}15` }}
                    >+ {name}</button>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom badge */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: '0.75rem' }}>Custom Badge</h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  value={customBadgeName}
                  onChange={e => setCustomBadgeName(e.target.value)}
                  placeholder="e.g. Trino, dbt Cloud…"
                  onKeyDown={e => { if (e.key === 'Enter' && customBadgeName) { addBadge(customBadgeName); setCustomBadgeName('') } }}
                  style={{ flex: 1 }}
                />
                <button onClick={() => { if (customBadgeName) { addBadge(customBadgeName); setCustomBadgeName('') } }} className="btn btn-warm">
                  Add
                </button>
              </div>
            </div>

            {badgeMsg && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-warm)', marginBottom: '1rem' }}>{badgeMsg}</p>}
            <div style={{display:'flex',gap:'0.75rem',marginBottom:'1rem',flexWrap:'wrap'}}>
              <button onClick={resetBadges} className="btn btn-outline" style={{fontSize:'0.8rem',color:'#e07840',borderColor:'#e0784040'}}>↩️ Clear all in "{badgeSection}"</button>
              <button onClick={()=>{setBadgeMsg('✅ Badges are live — they appear on site automatically!');setTimeout(()=>setBadgeMsg(''),3000)}} className="btn btn-warm" style={{background:'linear-gradient(135deg,#6bcb77,#4d96ff)'}}>🚀 Publish All</button>
            </div>

            {/* Current badges */}
            {badges.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: '0.75rem' }}>
                  Current badges in "{badgeSection}" ({badges.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {badges.map(b => (
                    <span key={b.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.25rem 0.65rem', borderRadius: '100px',
                      background: `${b.color || '#c77dff'}18`, border: `1px solid ${b.color || '#c77dff'}50`,
                      fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: b.color || 'var(--fg)',
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.color || '#c77dff', display: 'inline-block' }} />
                      {b.name}
                      <button
                        onClick={() => deleteBadge(b.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)', fontSize: '1rem', padding: '0 2px', lineHeight: 1 }}
                      >×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ SETTINGS TAB ══════════════ */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '500px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--fg)' }}>Settings</h1>
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

// ── Inline login form shown when /admin is visited without a session ──────────
function AdminLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [busy, setBusy]         = useState(false)
  const { login }               = useAdmin()
  const router                  = useRouter()

  const submit = async () => {
    if (!username || !password) { setError('Enter username and password'); return }
    setError('')
    setBusy(true)
    const result = await login(username, password)
    setBusy(false)
    if (result.success) {
      router.replace(result.isDefault ? '/admin?changeCredentials=1' : '/admin')
    } else {
      setError(result.error || 'Invalid credentials')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '1.5rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
          <span style={{ color: 'var(--accent-warm)' }}>P</span>G Admin
        </div>
        <p style={{ color: 'var(--fg-muted)', fontSize: '0.85rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
          Sign in to manage your portfolio
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem' }}>Username</label>
            <input
              type="text" value={username} autoFocus
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem' }}>Password</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        {error && (
          <p style={{
            color: '#e07840', fontSize: '0.82rem', marginBottom: '1rem',
            fontFamily: 'var(--font-mono)', padding: '0.5rem 0.75rem',
            background: 'rgba(224,120,64,0.1)', borderRadius: '6px',
            border: '1px solid rgba(224,120,64,0.25)',
          }}>⚠ {error}</p>
        )}
        <button
          onClick={submit} disabled={busy}
          className="btn btn-warm"
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
        >
          {busy ? 'Signing in…' : 'Sign in →'}
        </button>
        <p style={{ marginTop: '1.25rem', fontSize: '0.72rem', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          Default credentials: admin / admin
        </p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Loading…</p>
      </div>
    }>
      <AdminDashboard />
    </Suspense>
  )
}
