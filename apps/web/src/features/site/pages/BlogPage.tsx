export function BlogPage() {
  return (
    <div>
      <section className="bg-[radial-gradient(900px_circle_at_0%_0%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_circle_at_100%_20%,rgba(15,23,42,0.10),transparent_55%)] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-xs font-semibold text-slate-700">
              Conteúdo
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Blog e Notícias</h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600">Em breve. Atualizações institucionais do projeto e da plataforma.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="font-semibold text-slate-900">O que você vai ver aqui</p>
            <p className="mt-2 text-sm text-slate-600">
              Comunicados, evolução do ecossistema e materiais institucionais voltados a pais, atletas e escolinhas.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
