import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, GraduationCap, Trophy, Users } from 'lucide-react'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'

export function HomePathsSection() {
  return (
    <SiteSection variant="muted">
      <SiteContainer>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">Caminhos dentro do ecossistema</h2>
            <p className="mt-2 text-slate-600">Uma visão por perfil, com o que realmente importa para cada etapa da jornada.</p>
          </div>
          <Link to="/como-funciona" className="inline-flex items-center text-primary font-semibold hover:underline">
            Entender o fluxo <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/pais" className="hover:-translate-y-0.5 transition-transform">
            <SiteCard
              icon={<Users className="w-5 h-5 text-primary" />}
              title="Pais"
              description="Organização, rotina e acompanhamento com mais clareza ao longo do tempo."
              footer={<span className="text-sm text-primary font-semibold">Ver mais</span>}
            />
          </Link>
          <Link to="/atletas" className="hover:-translate-y-0.5 transition-transform">
            <SiteCard
              icon={<Trophy className="w-5 h-5 text-primary" />}
              title="Atletas"
              description="Disciplina, participação e histórico treino após treino, com seriedade."
              footer={<span className="text-sm text-primary font-semibold">Ver mais</span>}
            />
          </Link>
          <Link to="/escolinhas" className="hover:-translate-y-0.5 transition-transform">
            <SiteCard
              icon={<GraduationCap className="w-5 h-5 text-primary" />}
              title="Escolinhas"
              description="Padronização, gestão e comunicação com foco no dia a dia do treino."
              footer={<span className="text-sm text-primary font-semibold">Ver mais</span>}
            />
          </Link>
          <Link to="/como-funciona" className="hover:-translate-y-0.5 transition-transform">
            <SiteCard
              icon={<BarChart3 className="w-5 h-5 text-primary" />}
              title="Ecossistema"
              description="Escolinhas, núcleos, comunidade, scouts e clubes — conectados por contexto."
              footer={<span className="text-sm text-primary font-semibold">Ver mais</span>}
            />
          </Link>
        </div>
      </SiteContainer>
    </SiteSection>
  )
}

