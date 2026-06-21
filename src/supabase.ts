import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = normalizeEnvValue(
  import.meta.env.VITE_SUPABASE_URL,
  'VITE_SUPABASE_URL',
)
const supabaseAnonKey = normalizeEnvValue(
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  'VITE_SUPABASE_ANON_KEY',
).replace(/\s/g, '')

let client: SupabaseClient | null = null

function normalizeEnvValue(value: unknown, variableName: string): string {
  const rawValue = String(value ?? '').trim()
  const valueWithoutName = rawValue.startsWith(`${variableName}=`)
    ? rawValue.slice(variableName.length + 1).trim()
    : rawValue

  return valueWithoutName.replace(/^["']|["']$/g, '').trim()
}

function hasPlaceholder(value: string): boolean {
  return !value || value.includes('COLE_A_')
}

function assertValidSupabaseConfig(): void {
  if (hasPlaceholder(supabaseUrl) || hasPlaceholder(supabaseAnonKey)) {
    throw new Error('Variáveis do Supabase não configuradas.')
  }

  try {
    const url = new URL(supabaseUrl)

    if (!url.hostname.endsWith('.supabase.co')) {
      throw new Error()
    }
  } catch {
    throw new Error('VITE_SUPABASE_URL inválida.')
  }

  if (!supabaseAnonKey.includes('.') || /[\r\n\t ]/.test(supabaseAnonKey)) {
    throw new Error('VITE_SUPABASE_ANON_KEY inválida.')
  }
}

export function getSupabaseClient(): SupabaseClient {
  assertValidSupabaseConfig()

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
