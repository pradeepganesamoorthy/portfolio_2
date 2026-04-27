import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { items } = await req.json()
  await Promise.all(
    items.map(({ id, order }: { id: string; order: number }) =>
      prisma.portfolio.update({ where: { id }, data: { order } })
    )
  )
  return NextResponse.json({ success: true })
}
