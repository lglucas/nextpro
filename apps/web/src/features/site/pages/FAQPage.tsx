import { Link } from 'react-router-dom'

const FAQ_PARENTS = [
  { q: 'O NextPro é um aplicativo à venda?', a: 'Não. O NextPro é usado pelas escolinhas do projeto e por suas famílias.' },
  { q: 'Como eu acesso?', a: 'O acesso é orientado pela sua escolinha e pelo projeto, por convites e comunicação adequada.' },
  { q: 'O que eu vou ver?', a: 'Rotina, comunicados e um histórico mais consistente ao longo do tempo.' },
]

const FAQ_ATHLETES = [
  { q: 'O que significa “histórico” aqui?', a: 'É a evolução construída treino após treino, com contexto e consistência.' },
  { q: 'Eu preciso fazer algo todo dia?', a: 'A participação é orientada pela escolinha e pelo projeto, com foco em rotina.' },
]

const FAQ_SCHOOLS = [
  { q: 'O que muda no dia a dia?', a: 'Organização, presença, comunicados e padronização entre escolinhas do projeto.' },
  { q: 'Existe onboarding?', a: 'Sim. O projeto orienta a implantação e o padrão operacional.' },
]

const FAQ_PRIVACY = [
  { q: 'Como vocês tratam dados?', a: 'Com seriedade e finalidade clara. Veja detalhes na Política de Privacidade.' },
  { q: 'Posso pedir exclusão?', a: 'O canal institucional orienta solicitações conforme políticas aplicáveis.' },
]

function FAQSection({
  title,
  items,
}: {
  title: string
  items: Array<{ q: string; a: string }>
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.q}>
            <p className="font-semibold text-slate-900">{item.q}</p>
            <p className="mt-1 text-sm text-slate-600">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FAQPage() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Perguntas frequentes</h1>
          <p className="mt-4 text-slate-600">
            Respostas por categoria. Se não encontrar, fale com a equipe pelo canal institucional.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <FAQSection title="Pais" items={FAQ_PARENTS} />
          <FAQSection title="Atletas" items={FAQ_ATHLETES} />
          <FAQSection title="Escolinhas" items={FAQ_SCHOOLS} />
          <FAQSection title="Privacidade e Segurança" items={FAQ_PRIVACY} />
        </div>

        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">Ainda com dúvidas?</p>
            <p className="text-sm text-slate-600">Fale com a equipe NextPro.</p>
          </div>
          <Link
            to="/contato"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Contato
          </Link>
        </div>
      </div>
    </div>
  )
}

