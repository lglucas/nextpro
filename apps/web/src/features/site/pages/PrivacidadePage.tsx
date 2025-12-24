export function PrivacidadePage() {
  return (
    <div>
      <section className="bg-[radial-gradient(900px_circle_at_0%_0%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_circle_at_100%_20%,rgba(15,23,42,0.10),transparent_55%)] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-xs font-semibold text-slate-700">
              Legal
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Política de Privacidade</h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600">
              Conteúdo institucional inicial. Esta página será detalhada com finalidades, retenção e direitos do titular conforme
              a evolução do projeto.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Finalidade</h2>
            <p className="text-sm text-slate-600">
              Coletamos e tratamos dados para organizar a operação do projeto, melhorar a comunicação e construir histórico de
              evolução ao longo do tempo.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Segurança</h2>
            <p className="text-sm text-slate-600">
              Adotamos medidas de segurança para proteger dados e limitar acesso conforme perfis e permissões.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Contato</h2>
            <p className="text-sm text-slate-600">Solicitações podem ser encaminhadas pelo canal institucional de contato.</p>
          </section>
        </div>
      </section>
    </div>
  )
}
