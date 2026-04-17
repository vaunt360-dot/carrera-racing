import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const MODEL = 'imagen-4.0-fast-generate-001'

function buildPrompt(roundNumber: number, date: string): string {
  const month = new Date(date).toLocaleString('en', { month: 'long' })
  return [
    `Dramatic cinematic slot car racing track mood photography, round ${roundNumber}, ${month}.`,
    'Dark atmospheric scene. Miniature racing circuit with tight curves and banked turns.',
    'Neon accent lights casting red and blue reflections on the track surface.',
    'Shallow depth of field, ultra-realistic, wide-angle lens, high detail.',
    'Professional motorsport photography aesthetic. No text, no people, no hands.',
  ].join(' ')
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch race day
  const { data: raceDay, error: rdError } = await supabase
    .from('race_days')
    .select('round_number, date')
    .eq('id', id)
    .single()

  if (rdError || !raceDay) return NextResponse.json({ error: 'Race day not found' }, { status: 404 })

  // Call Imagen 4
  const prompt = buildPrompt(raceDay.round_number, raceDay.date)

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json()
    return NextResponse.json({ error: err?.error?.message ?? 'Imagen API error' }, { status: 500 })
  }

  const result = await response.json()
  const b64 = result?.predictions?.[0]?.bytesBase64Encoded
  if (!b64) return NextResponse.json({ error: 'No image returned' }, { status: 500 })

  // Save image to public/images/hero/
  const filename = `race-day-${raceDay.round_number}.jpg`
  const filepath = join(process.cwd(), 'public', 'images', 'hero', filename)
  await writeFile(filepath, Buffer.from(b64, 'base64'))

  const bannerUrl = `/images/hero/${filename}`

  // Save URL to DB
  const { error: updateError } = await supabase
    .from('race_days')
    .update({ banner_url: bannerUrl })
    .eq('id', id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ bannerUrl })
}
