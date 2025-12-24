import { Link } from 'react-router-dom'
import { ClipboardCheck, Compass, Trophy, Zap } from 'lucide-react'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteCallout } from '@/features/site/components/SiteCallout'

export function AtletasPage() {
  return (
    <div>
      <SiteHero
        eyebrow="Para Atletas"
        title="Sua evolução não é um palpite. É um histórico — treino após treino."
        description="Rotina, disciplina e participação no dia a dia ajudam a construir um caminho mais consistente, com mais contexto ao longo do tempo."
      />

      <SiteSection>
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">O que importa de verdade</h2>
              <p className="mt-3 text-slate-600">
                A base é feita de repetição, consistência e rotina. O NextPro não é sobre “um dia bom” — é sobre construir
                histórico, entender evolução e dar clareza para quem acompanha sua jornada.
              </p>
              <p className="mt-3 text-slate-600">
                A plataforma organiza o dia a dia com responsabilidade e linguagem simples, sem promessas exageradas. O foco
                é disciplina, presença, participação e contexto.
              </p>
              <div className="mt-6">
                <Link to="/como-funciona" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Entender o ecossistema
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <SiteCard
                icon={<Trophy className="w-5 h-5 text-primary" />}
                title="Rotina"
                description="Treino após treino, com consistência e foco no que importa."
              />
              <SiteCard
                icon={<ClipboardCheck className="w-5 h-5 text-primary" />}
                title="Participação"
                description="O atleta registra contexto e percepção diária do treino, construindo disciplina."
              />
              <SiteCard
                icon={<Compass className="w-5 h-5 text-primary" />}
                title="Caminho"
                description="Escolinhas, núcleos, comunidade, scouts e clubes conectados ao longo do tempo."
              />
              <SiteCard
                icon={<Zap className="w-5 h-5 text-primary" />}
                title="Evolução"
                description="Uma visão mais completa, baseada em consistência e histórico."
              />
            </div>
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection variant="muted">
        <SiteContainer>
          <SiteCallout
            title="Acesso orientado pela escolinha"
            description="O acesso é feito por comunicação e convites do projeto e das escolinhas participantes."
            actions={
              <>
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Ver FAQ
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
                >
                  Entrar
                </Link>
              </>
            }
          />
        </SiteContainer>
      </SiteSection>
    </div>
  )
}
