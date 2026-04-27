import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const config = await prisma.githubConfig.findFirst()
  return NextResponse.json({ config })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const existing = await prisma.githubConfig.findFirst()

  const config = existing
    ? await prisma.githubConfig.update({ where: { id: existing.id }, data: body })
    : await prisma.githubConfig.create({ data: body })

  return NextResponse.json({ config })
}
