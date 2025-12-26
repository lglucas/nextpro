import { Link } from 'react-router-dom'
import { BarChart3, GraduationCap, HeartHandshake, Landmark, Network, Users } from 'lucide-react'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteCallout } from '@/features/site/components/SiteCallout'
import { SiteAuthCtaButton } from '@/features/site/components/SiteAuthCtaButton'

export function ComoFuncionaPage() {
  return (
    <div>
      <SiteHero
        eyebrow="Como Funciona"
        title="Um ecossistema conectado, com mais contexto e seriedade."
        description="Escolinhas, núcleos, comunidade, scouts e clubes se conectam ao longo do tempo. O NextPro organiza esse caminho com histórico e padrão de operação."
      />

      <SiteSection>
        <SiteContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">Fluxo</h2>
            <p className="mt-2 text-slate-600">
              O foco é transformar rotina em histórico — com contexto suficiente para que a evolução do atleta seja mais clara
              para famílias, mais organizada para escolinhas e mais séria para observação e conversas futuras.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SiteCard
              icon={<GraduationCap className="w-5 h-5 text-primary" />}
              title="Dia a dia na escolinha"
              description="Rotina, presença, comunicação e acompanhamento como base do histórico."
            />
            <SiteCard
              icon={<Network className="w-5 h-5 text-primary" />}
              title="Núcleos"
              description="Momentos de acompanhamento e avaliação com a equipe técnica NextPro, reforçando qualidade e contexto."
            />
            <SiteCard
              icon={<Users className="w-5 h-5 text-primary" />}
              title="Comunidade"
              description="Engajamento e interação com mais organização — fortalecendo pertencimento e apoio."
            />
            <SiteCard
              icon={<BarChart3 className="w-5 h-5 text-primary" />}
              title="Scouts"
              description="Observações com mais clareza de contexto, conectadas ao histórico construído no tempo."
            />
            <SiteCard
              icon={<Landmark className="w-5 h-5 text-primary" />}
              title="Clubes"
              description="Conversas futuras com mais seriedade, com histórico e consistência como referência."
            />
            <SiteCard
              icon={<HeartHandshake className="w-5 h-5 text-primary" />}
              title="Plataforma"
              description="A camada que conecta o ecossistema, organiza rotinas e preserva contexto ao longo do tempo."
            />
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection variant="muted">
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Atalhos por perfil</h2>
              <p className="mt-3 text-slate-600">
                Se você quer ir direto ao ponto, veja o conteúdo por perfil. Cada página explica o que muda no dia a dia e o
                que esperar do ecossistema.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/pais" className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
                  Para Pais
                </Link>
                <Link to="/atletas" className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
                  Para Atletas
                </Link>
                <Link to="/escolinhas" className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
                  Para Escolinhas
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="font-semibold text-slate-900">Perguntas frequentes</p>
              <p className="mt-2 text-sm text-slate-600">Veja respostas por categoria (pais, atletas, escolinhas e privacidade).</p>
              <div className="mt-5">
                <Link to="/faq" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Ver FAQ
                </Link>
              </div>
            </div>
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection>
        <SiteContainer>
          <SiteCallout
            title="Quer falar com a equipe?"
            description="Use o canal institucional para dúvidas e alinhamentos."
            actions={
              <>
                <Link
                  to="/contato"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Contato
                </Link>
                <SiteAuthCtaButton
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
                  loggedInLabel="Ir para o app"
                />
              </>
            }
          />
        </SiteContainer>
      </SiteSection>
    </div>
  )
}
