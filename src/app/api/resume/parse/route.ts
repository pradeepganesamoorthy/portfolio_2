import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { parseResume } from '@/lib/resume-parser'

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const parsed = await parseResume(buffer, file.type)

  return NextResponse.json({ parsed })
}
