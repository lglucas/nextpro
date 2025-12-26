export function ConsentStep({
  accepted,
  onChange,
  botTrap,
  onBotTrapChange,
}: {
  accepted: boolean
  onChange: (next: boolean) => void
  botTrap: string
  onBotTrapChange: (next: string) => void
}) {
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

      <div className="sr-only">
        <label htmlFor="company">Empresa</label>
        <input id="company" value={botTrap} onChange={(e) => onBotTrapChange(e.target.value)} />
      </div>
    </div>
  )
}
