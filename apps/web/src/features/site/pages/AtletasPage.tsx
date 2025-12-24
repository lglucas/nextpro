import { Link } from 'react-router-dom'

export function AtletasPage() {
  return (
    <div className="bg-white">
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Sua evolução não é um palpite. É um histórico — treino após treino.
            </h1>
            <p className="mt-4 text-slate-600">
              Rotina, disciplina e participação no dia a dia ajudam a construir uma visão mais completa ao longo do tempo.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/como-funciona"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
              >
                Como funciona
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Rotina</h2>
            <p className="mt-3 text-slate-600">Treino após treino, com consistência e foco no que importa.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Participação</h2>
            <p className="mt-3 text-slate-600">
              O atleta participa registrando contexto e percepção diária do treino, ajudando a construir disciplina.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Caminho</h2>
            <p className="mt-3 text-slate-600">
              Escolinhas + histórico + núcleos (quando aplicável): um ecossistema conectado ao longo do tempo.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

