import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, publishAll } = body

  if (publishAll) {
    await prisma.video.updateMany({
      where: { isDraft: true },
      data: {
        isDraft: false
      },
    })
    return NextResponse.json({ success: true, message: 'All videos published' })
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 })
  }

  const video = await prisma.video.update({
    where: { id },
    data: {
      isDraft: false
    },
  })

  return NextResponse.json({ success: true, video })
}
