import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Cup } from '@/lib/constants'

interface ResultPayload {
  race_day_id: string
  driver_id: string
  cup: Cup
  race_number: 1 | 2
  position: number | null
  dns: boolean
  pole: boolean
}

interface DeleteEntry {
  driver_id: string
  cup: Cup
  race_number: 1 | 2
}

interface PutBody {
  results: ResultPayload[]
  toDelete: DeleteEntry[]
  cancelled: boolean
  notes: string
  date?: string
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: PutBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { results, toDelete, cancelled, notes, date } = body

  // Update race day
  const updatePayload: Record<string, unknown> = { cancelled, notes: notes || null }
  if (date) updatePayload.date = date

  const { error: rdError } = await supabase
    .from('race_days')
    .update(updatePayload)
    .eq('id', id)

  if (rdError) {
    return NextResponse.json({ error: rdError.message }, { status: 500 })
  }

  if (cancelled) {
    // Delete all existing results for this day
    const { error: delError } = await supabase
      .from('race_results')
      .delete()
      .eq('race_day_id', id)

    if (delError) {
      return NextResponse.json({ error: delError.message }, { status: 500 })
    }
  } else {
    // Upsert results with data
    if (results.length > 0) {
      const { error: upsertError } = await supabase
        .from('race_results')
        .upsert(results, { onConflict: 'race_day_id,driver_id,cup,race_number' })

      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 500 })
      }
    }

    // Delete empty slots
    for (const entry of (toDelete ?? [])) {
      await supabase
        .from('race_results')
        .delete()
        .eq('race_day_id', id)
        .eq('driver_id', entry.driver_id)
        .eq('cup', entry.cup)
        .eq('race_number', entry.race_number)
    }
  }

  return NextResponse.json({ success: true })
}
