import { supabase } from '@/lib/supabase'

export async function hasAcceptedTerms(userId: string, termsVersion: string) {
  const { data, error } = await supabase
    .from('terms_acceptances')
    .select('id')
    .eq('user_id', userId)
    .eq('terms_version', termsVersion)
    .limit(1)

  if (error) throw new Error(error.message)
  return (data || []).length > 0
}

export async function acceptTerms(termsVersion: string, termsUrl: string, meta?: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('terms-accept', {
    body: { termsVersion, termsUrl, meta: meta || {} },
  })

  if (error) throw new Error(error.message)
  if (!data?.success) throw new Error('Falha ao registrar aceite')
}

