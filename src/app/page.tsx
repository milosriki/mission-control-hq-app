import { supabase } from '@/lib/supabase';
import { Bot, Network, Wrench, Shield, Zap, RefreshCw } from 'lucide-react';

export const revalidate = 0; // Disable static caching for live test

async function fetchAgents() {
  const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Supabase fetch error:', error);
    return null;
  }
  return data;
}

export default async function DashboardPage() {
  const agents = await fetchAgents();

  return (
    <div className="min-h-screen bg-neutral-bg1 text-text-primary p-6 lg:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-dataviz-blue/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <header className="flex justify-between items-center mb-12 animate-slide-down">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
            Mission Control HQ
          </h1>
          <p className="text-text-muted mt-2 text-sm max-w-xl">
            Central orchestration hub for autonomous single agents, multi-agent crews, memory indices, and custom tooling integration.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="glass px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4 text-dataviz-yellow" />
            System Status
          </button>
          <button className="bg-brand hover:bg-brand-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-glow">
            Deploy New Agent
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-subtle rounded-lg">
              <Bot className="w-6 h-6 text-brand-light" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Active Agents</h2>
              <p className="text-xs text-text-muted">Single & Autonomous</p>
            </div>
          </div>
          <p className="text-3xl font-bold">{agents ? agents.length : '—'}</p>
        </div>

        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-dataviz-blue/15 rounded-lg">
              <Network className="w-6 h-6 text-dataviz-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Orchestration Crews</h2>
              <p className="text-xs text-text-muted">LangGraph & CrewAI</p>
            </div>
          </div>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-dataviz-green/15 rounded-lg">
              <Shield className="w-6 h-6 text-dataviz-green" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Secure Tools</h2>
              <p className="text-xs text-text-muted">MCP Connected</p>
            </div>
          </div>
          <p className="text-3xl font-bold">48</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass-panel p-8 rounded-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Live Agents Database</h3>
            <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              Supabase Connected
            </span>
          </div>

          {!agents ? (
            <div className="py-12 text-center text-status-error border border-status-error/20 bg-status-error/5 rounded-xl">
              Failed to connect to Supabase. Check environment variables.
            </div>
          ) : agents.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-xl bg-white/5">
              <RefreshCw className="w-8 h-8 text-text-muted mb-4 opacity-50" />
              <p className="text-text-secondary">No agents provisioned yet.</p>
              <form action={async () => {
                'use server';
                const { createClient } = await import('@supabase/supabase-js');
                const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
                await adminClient.from('agents').insert([{ name: 'Alpha Auto-Provisioner', type: 'orchestrator', model: 'claude-opus-4.6', status: 'idle' }]);
              }}>
                <button type="submit" className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors cursor-pointer">
                  Setup First Test Agent (Server Action)
                </button>
              </form>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary">
                    <th className="pb-3 font-medium">Agent ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Model</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {agents.map((agent: { id: string; name: string; type: string; model: string; status: string }) => (
                    <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 text-xs font-mono text-text-muted">{agent.id.slice(0, 8)}...</td>
                      <td className="py-4 font-medium text-white">{agent.name}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 text-xs rounded-md bg-white/10 border border-white/5">
                          {agent.type}
                        </span>
                      </td>
                      <td className="py-4 text-text-secondary">{agent.model}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-status-success">
                          <div className="w-2 h-2 rounded-full bg-status-success" />
                          <span className="capitalize">{agent.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-panel p-8 rounded-2xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-xl font-semibold mb-6">Workflow Modules</h3>
          <div className="space-y-4">
            <div className="p-4 glass-card border-brand/30 hover:border-brand transition-colors cursor-pointer flex gap-4 items-start">
              <Bot className="w-5 h-5 text-brand mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">Single Agents</h4>
                <p className="text-xs text-text-muted">Deploy fully autonomous individual workers.</p>
              </div>
            </div>
            
            <div className="p-4 glass-card border-white/10 hover:border-white/30 transition-colors cursor-pointer flex gap-4 items-start">
              <Network className="w-5 h-5 text-dataviz-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">Multi-Agent Crews</h4>
                <p className="text-xs text-text-muted">Orchestrate delegation via CrewAI logic.</p>
              </div>
            </div>

            <div className="p-4 glass-card border-white/10 hover:border-white/30 transition-colors cursor-pointer flex gap-4 items-start">
              <Wrench className="w-5 h-5 text-dataviz-yellow mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">MCP Tool Integrations</h4>
                <p className="text-xs text-text-muted">Manage protocol connections and tool access.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
