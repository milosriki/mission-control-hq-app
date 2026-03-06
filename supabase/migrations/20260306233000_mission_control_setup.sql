-- Agents Table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g., 'research', 'code', 'marketing'
  model TEXT NOT NULL, -- e.g., 'claude-opus-4.6', 'gpt-o3'
  status TEXT DEFAULT 'idle', -- 'idle', 'working', 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo', -- 'todo', 'in-progress', 'done'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  agent_id UUID REFERENCES agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metrics Table
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_usage BIGINT DEFAULT 0,
  success_rate FLOAT DEFAULT 1.0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE agents;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE metrics;
