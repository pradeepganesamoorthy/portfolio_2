import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const admin = await prisma.admin.findUnique({ where: { username } })
  if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const token = await signToken({ adminId: admin.id, isDefault: admin.isDefault })
  const res = NextResponse.json({ success: true, isDefault: admin.isDefault })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
