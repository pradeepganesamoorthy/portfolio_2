'use client'
import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'fade'
  className?: string
  style?: React.CSSProperties
}

export function ScrollReveal({ children, delay = 0, direction = 'up', className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const initTransform: Record<string, string> = {
      up: 'translateY(40px)',
      left: 'translateX(-40px)',
      right: 'translateX(40px)',
      fade: 'scale(0.96)',
    }

    el.style.opacity = '0'
    el.style.transform = initTransform[direction]
    el.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'none'
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, direction])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
