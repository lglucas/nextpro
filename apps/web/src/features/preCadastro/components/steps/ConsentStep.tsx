import { useEffect, useRef, useState } from 'react'
import { loadTurnstileScript } from '@/lib/turnstile'

export function ConsentStep({
  accepted,
  onChange,
  botTrap,
  onBotTrapChange,
  turnstileToken,
  onTurnstileTokenChange,
}: {
  accepted: boolean
  onChange: (next: boolean) => void
  botTrap: string
  onBotTrapChange: (next: string) => void
  turnstileToken: string | null
  onTurnstileTokenChange: (next: string | null) => void
}) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [turnstileError, setTurnstileError] = useState<string | null>(null)

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
            onTurnstileTokenChange(token)
            setTurnstileError(null)
          },
          'expired-callback': () => {
            onTurnstileTokenChange(null)
          },
          'error-callback': () => {
            onTurnstileTokenChange(null)
            setTurnstileError('Não foi possível validar. Recarregue a página e tente novamente.')
          },
        })
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Falha ao carregar Turnstile'
        setTurnstileError(message)
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
  }, [onTurnstileTokenChange, siteKey])

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <p className="font-semibold text-slate-900">Confirmação</p>
        <p className="mt-2 text-sm text-slate-600">
          Ao enviar, você confirma que as informações fornecidas são verdadeiras e autoriza o uso para fins de organização do
          projeto e operação da escolinha, conforme políticas aplicáveis.
        </p>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4"
          id="consent"
        />
        <label htmlFor="consent" className="text-sm text-slate-700">
          Li e concordo com o envio do pré‑cadastro.
        </label>
      </div>

      {siteKey ? (
        <div>
          <div ref={containerRef} />
          {turnstileError ? <p className="mt-2 text-xs text-red-600">{turnstileError}</p> : null}
          {!turnstileError && !turnstileToken ? (
            <p className="mt-2 text-xs text-slate-500">Valide a verificação acima para liberar o envio.</p>
          ) : null}
        </div>
      ) : null}

      <div className="sr-only">
        <label htmlFor="company">Empresa</label>
        <input id="company" value={botTrap} onChange={(e) => onBotTrapChange(e.target.value)} />
      </div>
    </div>
  )
}
