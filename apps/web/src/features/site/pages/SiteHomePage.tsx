import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, GraduationCap, ShieldCheck, Trophy, Users } from 'lucide-react'

export function SiteHomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">O futuro do esporte começa na base.</h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600">
              NextPro é a plataforma que digitaliza a operação da Reglobo Soccer — para dar mais organização, consistência e
              transparência ao dia a dia.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors">
                Entrar
              </Link>
              <Link to="/projeto" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors">
                Entender o projeto <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Uma plataforma para organizar e evoluir no digital</h2>
            <p className="text-slate-600">
              O NextPro conecta rotina, organização e histórico de evolução em um só lugar, com linguagem clara para famílias
              e padronização para as escolinhas do projeto.
            </p>
            <p className="text-slate-600">
              Nossa missão é tornar o acompanhamento mais consistente — para que o dia a dia gere um histórico confiável ao
              longo do tempo.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Números de impacto (Reglobo Soccer)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">13</p>
                <p className="text-sm text-slate-600">anos de operação</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">12</p>
                <p className="text-sm text-slate-600">estados</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">38.114</p>
                <p className="text-sm text-slate-600">atletas avaliados</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">10–12</p>
                <p className="text-sm text-slate-600">escolinhas prontas</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              No futuro, estes números poderão ser atualizados em tempo real pela plataforma.
            </p>
          </div>
        </div>
      </section>
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Para quem é</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">Conteúdo por perfil, com linguagem institucional e foco no dia a dia da base.</p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/pais" className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <Users className="w-6 h-6 text-primary" />
              <p className="mt-3 font-semibold text-slate-900">Pais</p>
              <p className="mt-1 text-sm text-slate-600">Organização, rotina e histórico com mais clareza.</p>
              <p className="mt-3 text-sm text-primary group-hover:underline">Ver mais</p>
            </Link>

            <Link to="/atletas" className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <Trophy className="w-6 h-6 text-primary" />
              <p className="mt-3 font-semibold text-slate-900">Atletas</p>
              <p className="mt-1 text-sm text-slate-600">Evolução treino após treino, sem promessas exageradas.</p>
              <p className="mt-3 text-sm text-primary group-hover:underline">Ver mais</p>
            </Link>

            <Link to="/escolinhas" className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <GraduationCap className="w-6 h-6 text-primary" />
              <p className="mt-3 font-semibold text-slate-900">Escolinhas</p>
              <p className="mt-1 text-sm text-slate-600">Gestão padronizada, comunicação e dados consistentes.</p>
              <p className="mt-3 text-sm text-primary group-hover:underline">Ver mais</p>
            </Link>

            <Link to="/como-funciona" className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <BarChart3 className="w-6 h-6 text-primary" />
              <p className="mt-3 font-semibold text-slate-900">Ecossistema</p>
              <p className="mt-1 text-sm text-slate-600">Escolinhas, núcleos, scouts e clubes com mais contexto.</p>
              <p className="mt-3 text-sm text-primary group-hover:underline">Ver mais</p>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Como funciona (visão geral)</h2>
              <p className="mt-2 text-slate-600">
                Um ecossistema conectado: rotina nas escolinhas, momentos de acompanhamento no núcleo (quando aplicável) e
                histórico consistente ao longo do tempo.
              </p>
              <Link to="/como-funciona" className="mt-6 inline-flex items-center text-primary font-semibold hover:underline">
                Ver como funciona <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <p className="mt-3 font-semibold text-slate-900">Consistência</p>
                <p className="mt-1 text-sm text-slate-600">Histórico construído ao longo do tempo, não por um único dia.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <BarChart3 className="w-6 h-6 text-primary" />
                <p className="mt-3 font-semibold text-slate-900">Transparência</p>
                <p className="mt-1 text-sm text-slate-600">Mais clareza para famílias e padronização para as escolinhas.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <GraduationCap className="w-6 h-6 text-primary" />
                <p className="mt-3 font-semibold text-slate-900">Operação</p>
                <p className="mt-1 text-sm text-slate-600">Gestão e comunicação organizadas, com foco no que importa.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <Trophy className="w-6 h-6 text-primary" />
                <p className="mt-3 font-semibold text-slate-900">Evolução</p>
                <p className="mt-1 text-sm text-slate-600">Rotina, disciplina e acompanhamento com seriedade.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Perguntas frequentes</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">Respostas por categoria para pais, atletas, escolinhas e privacidade.</p>
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900">O NextPro é um aplicativo à venda?</p>
                <p className="mt-1 text-sm text-slate-600">Não. O NextPro é a plataforma que organiza e digitaliza a operação das escolinhas do projeto.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Como as famílias acessam?</p>
                <p className="mt-1 text-sm text-slate-600">O acesso é orientado pelas escolinhas participantes e pelo projeto, com comunicação e convites adequados.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Onde encontro informações por perfil?</p>
                <p className="mt-1 text-sm text-slate-600">Veja as páginas “Pais”, “Atletas” e “Escolinhas” para uma visão direta.</p>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/faq" className="inline-flex items-center text-primary font-semibold hover:underline">
                Ver todas as perguntas <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Contato institucional</h2>
              <p className="mt-2 text-slate-200 max-w-2xl">Quer falar com a equipe NextPro? Use o canal institucional para dúvidas e alinhamentos.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/contato" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
                Falar com a equipe
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
