import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public client — uses anon key, respects RLS policies
// Safe for client-side and Server Components (read-only via RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — uses service role key, bypasses RLS
// ONLY use in API routes and Server Actions (never expose to client)
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — cannot create admin client')
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
