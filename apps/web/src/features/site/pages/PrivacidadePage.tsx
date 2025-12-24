export function PrivacidadePage() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Política de Privacidade</h1>
        <p className="mt-4 text-slate-600">
          Conteúdo institucional inicial. Esta página será detalhada com finalidades, retenção e direitos do titular conforme
          a evolução do projeto.
        </p>
        <div className="mt-10 space-y-6 text-slate-700">
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
      </div>
    </div>
  )
}

