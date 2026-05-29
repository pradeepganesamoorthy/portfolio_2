import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const section = searchParams.get('section')

    const where: any = {}
    if (section) where.section = section

    const badges = await prisma.badge.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ badges })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { section, name, type, iconName, customImage, color } = body

    if (!section || !name) {
      return NextResponse.json(
        { error: 'Section and name are required' },
        { status: 400 }
      )
    }

    const maxOrderBadge = await prisma.badge.findFirst({
      where: { section },
      orderBy: { order: 'desc' },
    })

    const newOrder = maxOrderBadge ? maxOrderBadge.order + 1 : 0

    const badge = await prisma.badge.create({
      data: {
        section,
        name,
        type: type || 'preset',
        iconName,
        customImage,
        color,
        order: newOrder,
      },
    })

    return NextResponse.json({ success: true, badge })
  } catch (error) {
    console.error('Error creating badge:', error)
    return NextResponse.json({ error: 'Failed to create badge' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Badge ID required' }, { status: 400 })
    }

    const badge = await prisma.badge.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, badge })
  } catch (error) {
    console.error('Error updating badge:', error)
    return NextResponse.json({ error: 'Failed to update badge' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Badge ID required' }, { status: 400 })
    }

    await prisma.badge.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting badge:', error)
    return NextResponse.json({ error: 'Failed to delete badge' }, { status: 500 })
  }
}
