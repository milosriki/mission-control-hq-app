import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceClient } from '@/lib/supabase'

// GET /api/agents/:id — Get single agent with related tasks
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [agentRes, tasksRes] = await Promise.all([
    supabase.from('agents').select('*').eq('id', id).single(),
    supabase.from('tasks').select('*').eq('agent_id', id).order('created_at', { ascending: false }),
  ])

  if (agentRes.error) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  return NextResponse.json({
    agent: agentRes.data,
    tasks: tasksRes.data ?? [],
  })
}

// PATCH /api/agents/:id — Update agent (status, model, type)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const allowed = ['name', 'type', 'model', 'status']
    const updates: Record<string, string> = {}

    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const admin = getServiceClient()
    const { data, error } = await admin
      .from('agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent: data })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE /api/agents/:id — Decommission agent
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const admin = getServiceClient()
  const { error } = await admin.from('agents').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ deleted: true }, { status: 200 })
}
