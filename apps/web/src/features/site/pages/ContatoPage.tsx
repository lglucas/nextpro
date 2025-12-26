import { useEffect, useRef, useState } from 'react'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'
import { supabase } from '@/lib/supabase'
import { loadTurnstileScript } from '@/lib/turnstile'

export function ContatoPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSent, setIsSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [botTrap, setBotTrap] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (!siteKey) return
    if (!containerRef.current) return

    let cancelled = false

    const mount = async () => {
      try {
        await loadTurnstileScript()
        if (cancelled) return
        if (!window.turnstile) throw new Error('Turnstile indisponível')
        if (!containerRef.current) return

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'auto',
          callback: (token) => {
            setTurnstileToken(token)
          },
          'expired-callback': () => {
            setTurnstileToken(null)
          },
          'error-callback': () => {
            setTurnstileToken(null)
          },
        })
      } catch {
        setTurnstileToken(null)
      }
    }

    mount()

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (botTrap.trim() !== '') {
      setIsSent(true)
      return
    }

    if (siteKey && !turnstileToken) {
      setError('Conclua a verificação antes de enviar.')
      return
    }

    setSending(true)

    try {
      if (siteKey && turnstileToken) {
        const { data, error: captchaError } = await supabase.functions.invoke('turnstile-verify', {
          body: { token: turnstileToken },
        })
        if (captchaError || !data?.success) {
          throw new Error('Falha na verificação. Tente novamente.')
        }
      }

      const { error: insertError } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        page_url: typeof window === 'undefined' ? null : window.location.href,
        meta: {
          userAgent: typeof navigator === 'undefined' ? null : navigator.userAgent,
          language: typeof navigator === 'undefined' ? null : navigator.language,
          submittedAtClient: new Date().toISOString(),
        },
      })

      if (insertError) throw new Error(insertError.message)
      setIsSent(true)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao enviar mensagem'
      setError(message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <SiteHero eyebrow="Contato" title="Contato institucional" description="Fale com a equipe NextPro pelo canal institucional." />

      <SiteSection variant="muted">
        <SiteContainer>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              {isSent ? (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">Mensagem enviada.</p>
                  <p className="text-sm text-slate-600">Obrigado pelo contato. Retornaremos assim que possível.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Nome</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Assunto</label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Mensagem</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  {error ? <p className="text-sm text-red-600">{error}</p> : null}
                  {siteKey ? <div ref={containerRef} /> : null}
                  <div className="sr-only">
                    <label htmlFor="company">Empresa</label>
                    <input id="company" value={botTrap} onChange={(e) => setBotTrap(e.target.value)} />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </SiteContainer>
      </SiteSection>
    </div>
  )
}
