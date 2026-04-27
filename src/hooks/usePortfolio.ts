'use client'
import { useState, useEffect } from 'react'

export function usePortfolio(section?: string) {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = section ? `/api/portfolio/sections?section=${section}` : '/api/portfolio/sections'
    fetch(url)
      .then(r => r.json())
      .then(d => setItems(d.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [section])

  const getValue = (key: string) => {
    const item = items.find(i => (i as { key: string }).key === key)
    return item ? (item as { value: unknown }).value : null
  }

  return { items, loading, getValue }
}
