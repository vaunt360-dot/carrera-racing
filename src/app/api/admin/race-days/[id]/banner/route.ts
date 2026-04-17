import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

async function getRaceDay(supabase: Awaited<ReturnType<typeof createClient>>, id: string) {
  const { data, error } = await supabase
    .from('race_days')
    .select('round_number, banner_url')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data
}

// POST — upload new banner image
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raceDay = await getRaceDay(supabase, id)
  if (!raceDay) return NextResponse.json({ error: 'Race day not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `race-day-${raceDay.round_number}.jpg`
  const filepath = join(process.cwd(), 'public', 'images', 'hero', filename)
  await writeFile(filepath, buffer)

  const bannerUrl = `/images/hero/${filename}`
  await supabase.from('race_days').update({ banner_url: bannerUrl }).eq('id', id)

  return NextResponse.json({ bannerUrl })
}

// DELETE — remove banner
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raceDay = await getRaceDay(supabase, id)
  if (!raceDay) return NextResponse.json({ error: 'Race day not found' }, { status: 404 })

  // Delete file if exists
  const filename = `race-day-${raceDay.round_number}.jpg`
  const filepath = join(process.cwd(), 'public', 'images', 'hero', filename)
  if (existsSync(filepath)) await unlink(filepath)

  await supabase.from('race_days').update({ banner_url: null }).eq('id', id)

  return NextResponse.json({ ok: true })
}
