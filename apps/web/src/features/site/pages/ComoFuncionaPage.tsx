import { Link } from 'react-router-dom'

export function ComoFuncionaPage() {
  return (
    <div className="bg-white">
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Escolinhas + Núcleos + Plataforma: um ecossistema conectado.
            </h1>
            <p className="mt-4 text-slate-600">
              A base é construída no dia a dia. O NextPro organiza esse caminho com histórico, consistência e contexto para o
              projeto.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/projeto"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
              >
                Projeto / Sobre
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Fluxo em macroetapas</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary">1</p>
              <p className="mt-2 font-semibold text-slate-900">Dia a dia na escolinha</p>
              <p className="mt-2 text-sm text-slate-600">Rotina, presença, comunicação e histórico ao longo do tempo.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary">2</p>
              <p className="mt-2 font-semibold text-slate-900">Núcleos (quando aplicável)</p>
              <p className="mt-2 text-sm text-slate-600">Momentos de acompanhamento e avaliação com equipe técnica NextPro.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary">3</p>
              <p className="mt-2 font-semibold text-slate-900">Profissionais e clubes</p>
              <p className="mt-2 text-sm text-slate-600">Mais contexto e seriedade para avaliações e conversas futuras.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Atalhos por perfil</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/pais" className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
              Pais
            </Link>
            <Link to="/atletas" className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
              Atletas
            </Link>
            <Link to="/escolinhas" className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
              Escolinhas
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

