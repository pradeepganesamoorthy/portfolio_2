'use client'
import { useEffect, useRef } from 'react'

export function PageFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ── Particle canvas — mouse-reactive, whole viewport ─────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth, H = window.innerHeight
    let mx = W / 2, my = H / 2
    let raf: number

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })

    const N   = Math.min(65, Math.floor(W / 24))
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const cols: string[] = (window as any).__themeColors || ['#3ddc97', '#237a57', '#6ee7b7']
      const pc = cols[0]; const lc = cols[1]; const ac = cols[2]

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.phase += 0.018
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy)
        if (d < 230) { p.vx += dx / d * 0.010; p.vy += dy / d * 0.010 }
        p.vx *= 0.978; p.vy *= 0.978
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        const pr = p.r * (1 + Math.sin(p.phase) * 0.25)
        const col = i % 3 === 0 ? pc : i % 3 === 1 ? lc : ac
        ctx.beginPath()
        ctx.arc(p.x, p.y, pr, 0, Math.PI * 2)
        ctx.fillStyle = col + '77'
        ctx.fill()

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dd = Math.hypot(p.x - q.x, p.y - q.y)
          if (dd < 145) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = lc + Math.floor((1 - dd / 145) * 50).toString(16).padStart(2,'0')
            ctx.lineWidth = 0.9; ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  /* ── Card 3-D tilt (never hides content) ─────────────────────────────── */
  useEffect(() => {
    const MAX = 6
    const onMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
      el.style.transform = `translateY(-6px) scale(1.008) perspective(800px) rotateY(${dx*MAX}deg) rotateX(${-dy*MAX}deg)`
    }
    const onLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement
      el.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease'
      el.style.transform  = ''
    }
    const onEnter = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement
      el.style.transition = 'transform 0.07s linear, box-shadow 0.3s ease'
    }
    const attach = () => {
      document.querySelectorAll<HTMLElement>('.card:not([data-tilt])').forEach(el => {
        el.dataset.tilt = '1'
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
      })
    }
    attach()
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])

  /* ── Section entrance reveal (safe: only triggers if already rendered) ── */
  useEffect(() => {
    const go = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('section:not(#hero)'))
      if (sections.length === 0) { setTimeout(go, 500); return }

      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement
            el.style.opacity   = '1'
            el.style.transform = 'none'
            io.unobserve(el)
          }
        })
      }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' })

      sections.forEach(sec => {
        // Only set initial state if content is visible (not display:none)
        const rect = sec.getBoundingClientRect()
        if (rect.height === 0) return  // skip if not rendered yet
        sec.style.opacity    = '0'
        sec.style.transform  = 'translateY(24px)'
        sec.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
        io.observe(sec)
      })
    }
    // Wait for Next.js hydration
    const t = setTimeout(go, 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        id="pg-canvas"
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          width: '100vw', height: '100vh',
          pointerEvents: 'none', zIndex: 0, opacity: 0.6,
        }}
      />
      <div aria-hidden="true" style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div id="pg-orb-1" style={{
          position:'absolute', top:'5%', right:'3%',
          width:'380px', height:'380px', borderRadius:'50%',
          background:'radial-gradient(circle, var(--theme-primary,#3ddc97)18 0%, transparent 70%)',
          filter:'blur(60px)', animation:'pgOrb1 20s ease-in-out infinite',
        }}/>
        <div id="pg-orb-2" style={{
          position:'absolute', bottom:'8%', left:'2%',
          width:'300px', height:'300px', borderRadius:'50%',
          background:'radial-gradient(circle, var(--theme-secondary,#237a57)15 0%, transparent 70%)',
          filter:'blur(52px)', animation:'pgOrb2 26s ease-in-out infinite 7s',
        }}/>
        <div id="pg-orb-3" style={{
          position:'absolute', top:'45%', left:'45%',
          width:'220px', height:'220px', borderRadius:'50%',
          background:'radial-gradient(circle, var(--theme-accent,#6ee7b7)12 0%, transparent 70%)',
          filter:'blur(45px)', animation:'pgOrb3 34s ease-in-out infinite 14s',
        }}/>
      </div>
      <style>{`
        @keyframes pgOrb1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-24px,34px) scale(1.08)}70%{transform:translate(18px,-20px) scale(0.94)}}
        @keyframes pgOrb2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(34px,-28px) scale(1.10)}65%{transform:translate(-16px,18px) scale(0.93)}}
        @keyframes pgOrb3{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(calc(-50% - 32px),calc(-50% + 42px)) scale(1.12)}}
      `}</style>
    </>
  )
}
