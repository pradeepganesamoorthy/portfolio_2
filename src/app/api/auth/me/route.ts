import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ admin: null })
  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId as string },
    select: { id: true, username: true, isDefault: true },
  })
  return NextResponse.json({ admin })
}
