import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getStats() {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) return { total_resumes: 0, total_users: 0 }
  return data
}

export async function incrementResumeCount() {
  await supabase.rpc('increment_resumes')
}

export async function incrementUserCount() {
  await supabase.rpc('increment_users')
}