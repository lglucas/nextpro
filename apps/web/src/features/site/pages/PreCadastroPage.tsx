import { Link } from 'react-router-dom'

export function PreCadastroPage() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Pré‑cadastro</h1>
        <p className="mt-4 text-slate-600">
          Esta página é usada por convite das escolinhas para coletar informações do censo familiar. A implementação do wizard
          e do fluxo de acesso dedicado será feita em etapas.
        </p>
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
  )
}

