import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

function toInputJson(
  value: Prisma.JsonValue
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { ids, publishAll } = body

    const publishedAt = new Date()

    if (publishAll) {
      const allItems = await prisma.portfolio.findMany()

      for (const item of allItems) {
        await prisma.portfolio.update({
          where: { id: item.id },
          data: {
            liveValue: toInputJson(item.draftValue),
            isDraft: false,
            publishedAt,
          },
        })
      }

      return NextResponse.json({
        success: true,
        publishedAt,
      })
    }

    if (Array.isArray(ids) && ids.length > 0) {
      for (const id of ids) {
        const item = await prisma.portfolio.findUnique({
          where: { id },
        })

        if (!item) continue

        await prisma.portfolio.update({
          where: { id },
          data: {
            liveValue: toInputJson(item.draftValue),
            isDraft: false,
            publishedAt,
          },
        })
      }

      return NextResponse.json({
        success: true,
        publishedAt,
      })
    }

    return NextResponse.json(
      { error: 'Provide ids or set publishAll to true' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error publishing portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to publish portfolio' },
      { status: 500 }
    )
  }
}