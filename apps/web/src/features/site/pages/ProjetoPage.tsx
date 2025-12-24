import { Link } from 'react-router-dom'
import { ArrowRight, Flag, Layers3, Target } from 'lucide-react'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteCallout } from '@/features/site/components/SiteCallout'

export function ProjetoPage() {
  return (
    <div>
      <SiteHero
        eyebrow="Projeto"
        title="Uma operação real no campo. Uma plataforma para organizar e evoluir no digital."
        description="A Reglobo Soccer construiu uma história na base. O NextPro nasce para digitalizar essa operação com padrão, linguagem clara e um histórico de evolução que acompanha o atleta ao longo do tempo."
      />

      <SiteSection>
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary">Reglobo Soccer</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">A operação e a experiência de campo</h2>
              <p className="mt-3 text-slate-600">
                A história do projeto foi construída no dia a dia: treino, rotina, relacionamento com famílias e formação.
                Esse lastro é o que dá verdade ao que fazemos.
              </p>
              <p className="mt-3 text-slate-600">
                Núcleos e avaliações qualificadas fazem parte do caminho, reforçando seriedade quando é hora de observar,
                comparar e acompanhar com mais profundidade.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary">NextPro</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">A camada de digitalização e padronização</h2>
              <p className="mt-3 text-slate-600">
                O NextPro organiza o que acontece na base com consistência: comunicação, rotina e histórico ao longo do tempo.
                Isso reduz ruído e cria contexto para todos os envolvidos.
              </p>
              <p className="mt-3 text-slate-600">
                A plataforma conecta escolinhas, núcleos, comunidade, scouts e clubes — sem perder o foco no que importa: o
                treino e a evolução do atleta.
              </p>
            </div>
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection variant="muted">
        <SiteContainer>
          <h2 className="text-2xl font-bold text-slate-900">Missão, visão e compromissos</h2>
          <p className="mt-2 text-slate-600 max-w-3xl">
            Um projeto sério precisa de padrão, clareza e responsabilidade. Nossa ambição é organizar a base e construir um
            histórico que faça sentido ao longo do tempo.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <SiteCard
              icon={<Target className="w-5 h-5 text-primary" />}
              title="Missão"
              description="Digitalizar e padronizar a rotina do esporte de base para criar organização, consistência e transparência."
            />
            <SiteCard
              icon={<Flag className="w-5 h-5 text-primary" />}
              title="Visão"
              description="Construir um ecossistema conectado com histórico ao longo do tempo, do treino às avaliações qualificadas."
            />
            <SiteCard
              icon={<Layers3 className="w-5 h-5 text-primary" />}
              title="Compromissos"
              description="Seriedade no acompanhamento e proteção de dados como base de confiança para famílias e escolinhas."
            />
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection>
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">O que muda a partir daqui</h2>
              <p className="mt-3 text-slate-600">
                Em vez de depender de um único momento, o acompanhamento passa a ser construído no dia a dia — com mais
                consistência, mais contexto e uma base organizada para conversas futuras com scouts e clubes.
              </p>
              <p className="mt-3 text-slate-600">
                Quando existem avaliações qualificadas, elas reforçam o histórico e ajudam o ecossistema a enxergar melhor a
                evolução do atleta.
              </p>
              <div className="mt-6">
                <Link to="/como-funciona" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Ver como funciona <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <SiteCard title="Consistência" description="Evolução registrada ao longo do tempo, não por um único dia." />
              <SiteCard title="Transparência" description="Mais clareza para famílias e mais padrão para escolinhas." />
              <SiteCard title="Contexto" description="Rotina, presença e acompanhamento conectados em uma visão única." />
              <SiteCard title="Seriedade" description="Um caminho mais estruturado para avaliações e conversas futuras." />
            </div>
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection variant="muted">
        <SiteContainer>
          <SiteCallout
            title="Contato institucional"
            description="Quer falar com a equipe NextPro sobre o projeto, implantação e operação? Use o canal institucional."
            actions={
              <>
                <Link
                  to="/contato"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Contato
                </Link>
                <Link
                  to="/como-funciona"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
                >
                  Como funciona
                </Link>
              </>
            }
          />
        </SiteContainer>
      </SiteSection>
    </div>
  )
}
