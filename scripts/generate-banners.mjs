#!/usr/bin/env node
// scripts/generate-banners.mjs
// Generates hero banners for all 20 race days via Imagen 4 and saves them locally.

import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://ogkrxqlksgycvymylzad.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9na3J4cWxrc2d5Y3Z5bXlsemFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjg3OTksImV4cCI6MjA5MTk0NDc5OX0.hW52iATY-5l00uUhiWfz_dhVRNKfnYq6I14os_Ep6V8'
const GEMINI_KEY = 'AIzaSyD6D29_wP5SV-r_ggUF886ZM8D_Jia9mJA'
const MODEL = 'imagen-4.0-fast-generate-001'
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'hero')

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function prompt(round, date) {
  const month = MONTHS[new Date(date).getMonth()]
  const season = ['December','January','February'].includes(month) ? 'winter night' :
                 ['March','April','May'].includes(month) ? 'spring evening' :
                 ['June','July','August'].includes(month) ? 'summer dusk' : 'autumn twilight'
  return [
    `Dramatic cinematic slot car racing track mood photography, race round ${round}, ${month}, ${season}.`,
    'Dark atmospheric miniature racing circuit, tight banked curves, illuminated track borders.',
    'Neon accent lights in red and blue casting reflections on the glossy track surface.',
    'Shallow depth of field, ultra-realistic wide-angle lens, professional motorsport photography.',
    'No text, no people, no hands, no logos.',
  ].join(' ')
}

async function fetchRaceDays() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/race_days?select=id,round_number,date&order=round_number.asc`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  })
  return res.json()
}

async function generateImage(round, date) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt(round, date) }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' },
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message ?? 'Imagen error')
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('No image data returned')
  return Buffer.from(b64, 'base64')
}

async function updateBannerUrl(id, bannerUrl) {
  await fetch(`${SUPABASE_URL}/rest/v1/race_days?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ banner_url: bannerUrl }),
  })
}

async function main() {
  console.log('Fetching race days...')
  const raceDays = await fetchRaceDays()
  console.log(`Found ${raceDays.length} race days.\n`)

  for (const day of raceDays) {
    const filename = `race-day-${day.round_number}.jpg`
    const filepath = join(OUT_DIR, filename)
    const bannerUrl = `/images/hero/${filename}`

    process.stdout.write(`[${day.round_number}/20] Generating banner for round ${day.round_number} (${day.date})... `)
    try {
      const img = await generateImage(day.round_number, day.date)
      await writeFile(filepath, img)
      await updateBannerUrl(day.id, bannerUrl)
      console.log('✓')
    } catch (e) {
      console.log(`✗ ERROR: ${e.message}`)
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 800))
  }

  console.log('\nDone.')
}

main().catch(console.error)
