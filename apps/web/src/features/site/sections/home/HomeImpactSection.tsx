import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'

export function HomeImpactSection() {
  return (
    <SiteSection>
      <SiteContainer>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Uma operação real, agora com padrão e histórico</h2>
            <p className="text-slate-600">
              O NextPro existe para organizar a rotina e transformar o dia a dia em um histórico mais consistente ao longo do
              tempo — com comunicação mais clara para famílias e uma forma padronizada de operação para as escolinhas do
              projeto.
            </p>
            <p className="text-slate-600">
              É um ecossistema conectado: escolinhas, núcleos, comunidade, scouts e clubes. A plataforma entra como a camada
              que dá contexto e seriedade ao que acontece na base.
            </p>
            <div className="pt-2">
              <Link to="/projeto" className="inline-flex items-center text-primary font-semibold hover:underline">
                Conhecer o projeto <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-[radial-gradient(600px_circle_at_0%_0%,rgba(59,130,246,0.10),transparent_60%)]">
              <h3 className="font-semibold text-slate-900">Números de impacto (Reglobo Soccer)</h3>
              <p className="mt-1 text-sm text-slate-600">Histórico e alcance construídos no campo, ao longo de anos.</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">13</p>
                <p className="text-sm text-slate-600">anos de operação</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">12</p>
                <p className="text-sm text-slate-600">estados</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">38.114</p>
                <p className="text-sm text-slate-600">atletas avaliados</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-extrabold text-slate-900">10–12</p>
                <p className="text-sm text-slate-600">escolinhas prontas</p>
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  )
}

