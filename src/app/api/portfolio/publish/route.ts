import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { ids, publishAll } = body

  if (publishAll) {
    await prisma.portfolio.updateMany({
      data: { liveValue: undefined, isDraft: false, publishedAt: new Date() },
    })
    const allItems = await prisma.portfolio.findMany()
    for (const item of allItems) {
      await prisma.portfolio.update({
        where: { id: item.id },
        data: { liveValue: item.draftValue, isDraft: false, publishedAt: new Date() },
      })
    }
  } else if (ids?.length) {
    for (const id of ids) {
      const item = await prisma.portfolio.findUnique({ where: { id } })
      if (item) {
        await prisma.portfolio.update({
          where: { id },
          data: { liveValue: item.draftValue, isDraft: false, publishedAt: new Date() },
        })
      }
    }
  }

  return NextResponse.json({ success: true, publishedAt: new Date() })
}
