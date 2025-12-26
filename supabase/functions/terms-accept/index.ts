const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4)
  const decoded = atob(normalized + padding)
  return decoded
}

function getUserIdFromJwt(jwt: string) {
  const parts = jwt.split('.')
  if (parts.length < 2) return null
  try {
    const payloadRaw = base64UrlDecode(parts[1])
    const payload = JSON.parse(payloadRaw) as { sub?: string }
    return payload.sub ?? null
  } catch {
    return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ success: false, error: 'missing_supabase_env' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    const jwt = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null
    if (!jwt) {
      return new Response(JSON.stringify({ success: false, error: 'missing_auth' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userId = getUserIdFromJwt(jwt)
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'invalid_auth' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json().catch(() => null)) as
      | { termsVersion?: string; termsUrl?: string; meta?: Record<string, unknown> }
      | null
    const termsVersion = body?.termsVersion?.trim()
    const termsUrl = body?.termsUrl?.trim()
    if (!termsVersion) {
      return new Response(JSON.stringify({ success: false, error: 'missing_terms_version' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const ip =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      null
    const userAgent = req.headers.get('user-agent')

    const { createClient } = await import('npm:@supabase/supabase-js@2.88.0')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    })

    const payload = {
      user_id: userId,
      terms_version: termsVersion,
      terms_url: termsUrl || null,
      accepted_at: new Date().toISOString(),
      ip,
      user_agent: userAgent,
      meta: body?.meta || {},
    }

    const { error } = await supabase.from('terms_acceptances').upsert(payload, { onConflict: 'user_id,terms_version' })
    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown_error'
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

