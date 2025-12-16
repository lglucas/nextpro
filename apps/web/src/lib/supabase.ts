import { createClient } from '@supabase/supabase-js'

// Variáveis de ambiente devem ser configuradas no .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL ou Key não encontrados. Verifique seu .env')
}

/**
 * Cliente Supabase Singleton
 * Usado para todas as operações de banco e auth no frontend.
 */
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
