export function TermosPage() {
  return (
    <div>
      <section className="bg-[radial-gradient(900px_circle_at_0%_0%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_circle_at_100%_20%,rgba(15,23,42,0.10),transparent_55%)] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-xs font-semibold text-slate-700">
              Legal
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Termos de Uso</h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600">
              Conteúdo institucional inicial. Este documento será detalhado e formalizado conforme a evolução do projeto.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Escopo</h2>
            <p className="text-sm text-slate-600">
              O NextPro é a plataforma que digitaliza e organiza a operação do projeto, destinada às escolinhas participantes
              e suas famílias.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Uso responsável</h2>
            <p className="text-sm text-slate-600">
              O uso deve respeitar as regras do projeto, a privacidade e a integridade de informações de atletas e famílias.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}
