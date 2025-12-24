import { Link } from 'react-router-dom'

export function PaisPage() {
  return (
    <div className="bg-white">
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Acompanhe a jornada com mais clareza.</h1>
            <p className="mt-4 text-slate-600">Organização, rotina e um histórico construído no dia a dia.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
              >
                Ver dúvidas de pais
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">O que você vai encontrar</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>Organização da rotina e comunicação mais clara.</li>
              <li>Presença e contexto do dia a dia de forma estruturada.</li>
              <li>Histórico de evolução construído ao longo do tempo.</li>
              <li>Mais transparência e seriedade na jornada da base.</li>
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Privacidade</h2>
            <p className="mt-3 text-slate-600">
              Levamos proteção de dados a sério. Veja como tratamos informações e finalidades.
            </p>
            <div className="mt-5">
              <Link to="/privacidade" className="text-primary font-semibold hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

