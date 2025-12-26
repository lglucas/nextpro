import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, GraduationCap, ShieldCheck, Trophy } from 'lucide-react'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'

export function HomeHowItWorksSection() {
  return (
    <SiteSection>
      <SiteContainer>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">Como funciona</h2>
            <p className="mt-2 text-slate-600">
              A base é construída no dia a dia. O NextPro organiza esse caminho com histórico e contexto — fortalecendo a
              comunicação, o acompanhamento e a seriedade do processo.
            </p>
            <div className="mt-6">
              <Link to="/como-funciona" className="inline-flex items-center text-primary font-semibold hover:underline">
                Ver o fluxo completo <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <SiteCard
              icon={<ShieldCheck className="w-5 h-5 text-primary" />}
              title="Consistência"
              description="Histórico construído ao longo do tempo, com foco em rotina e disciplina."
            />
            <SiteCard
              icon={<BarChart3 className="w-5 h-5 text-primary" />}
              title="Transparência"
              description="Mais clareza para famílias e padronização para as escolinhas do projeto."
            />
            <SiteCard
              icon={<GraduationCap className="w-5 h-5 text-primary" />}
              title="Operação"
              description="Gestão e comunicação organizadas, sem burocratizar o treino."
            />
            <SiteCard
              icon={<Trophy className="w-5 h-5 text-primary" />}
              title="Evolução"
              description="Rotina e acompanhamento com seriedade — sem promessas exageradas."
            />
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  )
}

