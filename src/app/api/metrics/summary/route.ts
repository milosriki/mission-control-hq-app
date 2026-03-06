import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/metrics/summary — Aggregated dashboard metrics
export async function GET() {
  const [agentsRes, tasksRes, metricsRes] = await Promise.all([
    supabase.from('agents').select('id, status'),
    supabase.from('tasks').select('id, status, priority'),
    supabase.from('metrics').select('token_usage, success_rate'),
  ])

  const agents = agentsRes.data ?? []
  const tasks = tasksRes.data ?? []
  const metrics = metricsRes.data ?? []

  const totalTokens = metrics.reduce((sum, m) => sum + (m.token_usage ?? 0), 0)
  const avgSuccess =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + (m.success_rate ?? 0), 0) / metrics.length
      : 0

  return NextResponse.json({
    agents: {
      total: agents.length,
      working: agents.filter((a) => a.status === 'working').length,
      idle: agents.filter((a) => a.status === 'idle').length,
      error: agents.filter((a) => a.status === 'error').length,
    },
    tasks: {
      total: tasks.length,
      in_progress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      high_priority: tasks.filter((t) => t.priority === 'high').length,
    },
    metrics: {
      total_tokens: totalTokens,
      avg_success_rate: Math.round(avgSuccess * 1000) / 1000,
      records: metrics.length,
    },
  })
}
