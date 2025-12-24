import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function ProjetoPage() {
  return (
    <div className="bg-white">
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Uma operação real no campo. Uma plataforma para organizar e evoluir no digital.
            </h1>
            <p className="mt-4 text-slate-600">
              A Reglobo Soccer construiu uma história real na base. O NextPro nasce para levar essa experiência para o digital
              — com organização, padronização e um histórico de evolução que acompanha o atleta ao longo do tempo.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/como-funciona"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Como funciona <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
              >
                Contato institucional
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">História</h2>
            <p className="mt-3 text-slate-600">
              O projeto nasce da experiência prática e contínua na base. O objetivo do NextPro é transformar o dia a dia em
              um histórico mais consistente, com linguagem acessível para famílias e um padrão operacional para as escolinhas.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Missão</h2>
            <p className="mt-3 text-slate-600">
              Digitalizar e padronizar a rotina do esporte de base para criar mais organização, consistência e transparência.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Visão</h2>
            <p className="mt-3 text-slate-600">
              Construir um ecossistema conectado — escolinhas, núcleos e profissionais — com histórico ao longo do tempo.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Compromissos</h2>
            <p className="mt-3 text-slate-600">
              Seriedade, clareza no acompanhamento e proteção de dados como base de confiança para famílias e escolinhas.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">O que muda a partir daqui</h2>
          <p className="mt-3 text-slate-600 max-w-3xl">
            A proposta é simples: transformar o dia a dia em um histórico mais consistente, com acompanhamento ao longo do
            tempo. Quando há momentos de avaliação no núcleo e avaliações de profissionais credenciados, isso ajuda a
            qualificar ainda mais o contexto.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <p className="font-semibold text-slate-900">Consistência</p>
              <p className="mt-2 text-sm text-slate-600">Evolução registrada ao longo do tempo, não por um único dia.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <p className="font-semibold text-slate-900">Transparência</p>
              <p className="mt-2 text-sm text-slate-600">Mais clareza para famílias e mais padrão para escolinhas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900">Credibilidade e parceiros</h2>
            <p className="mt-3 text-slate-600">Seção institucional. Lista completa e logos: em breve.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

