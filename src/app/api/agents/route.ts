import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceClient } from '@/lib/supabase'

// GET /api/agents — List all agents (public, RLS-filtered)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let query = supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (type) query = query.eq('type', type)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agents: data, count: data?.length ?? 0 })
}

// POST /api/agents — Create a new agent (service role required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, model, status } = body

    if (!name || !type || !model) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, model' },
        { status: 400 }
      )
    }

    const admin = getServiceClient()
    const { data, error } = await admin
      .from('agents')
      .insert([{ name, type, model, status: status || 'idle' }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
