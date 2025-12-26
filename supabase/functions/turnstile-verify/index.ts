const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
    if (!secret) {
      return new Response(JSON.stringify({ success: false, error: 'missing_secret' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json().catch(() => null)) as { token?: string } | null
    const token = body?.token
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'missing_token' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const formData = new FormData()
    formData.append('secret', secret)
    formData.append('response', token)

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const verifyJson = (await verifyRes.json().catch(() => null)) as
      | { success?: boolean; 'error-codes'?: string[] }
      | null

    if (!verifyJson?.success) {
      return new Response(JSON.stringify({ success: false, error: 'invalid', codes: verifyJson?.['error-codes'] ?? [] }), {
        status: 403,
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

