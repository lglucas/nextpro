import { Link } from 'react-router-dom'

export function EscolinhasPage() {
  return (
    <div className="bg-white">
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Gestão padronizada, comunicação mais clara e dados consistentes.
            </h1>
            <p className="mt-4 text-slate-600">Sem perder o que importa: o treino e a evolução do atleta.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
              >
                Contato
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">O que é digitalizado</h2>
            <p className="mt-3 text-slate-600">Turmas, alunos, presença, comunicados e organização por unidade.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Padronização</h2>
            <p className="mt-3 text-slate-600">Um padrão único de rotina e acompanhamento entre escolinhas do projeto.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Convite aos pais</h2>
            <p className="mt-3 text-slate-600">
              A escolinha compartilha o link de pré‑cadastro com as famílias para iniciar o processo.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Dúvidas frequentes</h2>
          <p className="mt-2 text-slate-600">Veja perguntas específicas para escolinhas e operação.</p>
          <div className="mt-6">
            <Link to="/faq" className="text-primary font-semibold hover:underline">
              Ver FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

