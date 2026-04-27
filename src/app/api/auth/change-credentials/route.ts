import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { username, password } = await req.json()
  if (!username || !password || password.length < 6)
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  const hashed = await bcrypt.hash(password, 12)
  await prisma.admin.update({
    where: { id: session.adminId as string },
    data: { username, password: hashed, isDefault: false },
  })
  return NextResponse.json({ success: true })
}
