import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  const isAdmin = !!session
  const { searchParams } = new URL(req.url)
  const section = searchParams.get('section')

  const where: Record<string, unknown> = {}
  if (section) where.section = section
  if (!isAdmin) where.visible = true

  const items = await prisma.portfolio.findMany({
    where,
    orderBy: { updatedAt: 'asc' },
  })

  const result = items.map(item => ({
    ...item,
    value: isAdmin ? item.draftValue : (item.liveValue ?? item.draftValue),
  }))

  return NextResponse.json({ items: result })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { section, key, value, order = 0 } = body

  const item = await prisma.portfolio.upsert({
    where: { section_key: { section, key } },
    update: { draftValue: value, order, isDraft: true, updatedAt: new Date() },
    create: { section, key, draftValue: value, order, isDraft: true },
  })

  return NextResponse.json({ item })
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, value, visible, order } = body

  const item = await prisma.portfolio.update({
    where: { id },
    data: {
      ...(value !== undefined && { draftValue: value, isDraft: true }),
      ...(visible !== undefined && { visible }),
      ...(order !== undefined && { order }),
      updatedAt: new Date(),
    },
  })

  return NextResponse.json({ item })
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await prisma.portfolio.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
