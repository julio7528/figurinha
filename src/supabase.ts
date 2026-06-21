import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

function hasPlaceholder(value: string | undefined): boolean {
  return !value || value.includes('COLE_A_')
}

export function getSupabaseClient(): SupabaseClient {
  if (hasPlaceholder(supabaseUrl) || hasPlaceholder(supabaseAnonKey)) {
    throw new Error('Variáveis do Supabase não configuradas.')
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }

  return client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const supabaseClient = getSupabaseClient()
    const value = supabaseClient[property as keyof SupabaseClient]

    if (typeof value === 'function') {
      return value.bind(supabaseClient)
    }

    return value
  },
})
