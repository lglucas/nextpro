import { Link } from 'react-router-dom'
import { CalendarClock, MessageSquareText, ShieldCheck, Users } from 'lucide-react'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteCallout } from '@/features/site/components/SiteCallout'
import { SiteAuthCtaButton } from '@/features/site/components/SiteAuthCtaButton'

export function PaisPage() {
  return (
    <div>
      <SiteHero
        eyebrow="Para Pais"
        title="Acompanhe a jornada com mais clareza."
        description="Organização, comunicação e histórico construído no dia a dia — com uma linguagem simples e foco no que realmente importa."
      />

      <SiteSection>
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">O que muda para a família</h2>
              <p className="mt-3 text-slate-600">
                No esporte de base, a rotina é intensa. O NextPro organiza informações e comunicação para reduzir ruído e
                construir um acompanhamento mais consistente ao longo do tempo.
              </p>
              <p className="mt-3 text-slate-600">
                Você não precisa “adivinhar” o que está acontecendo: o foco é trazer clareza, previsibilidade e contexto, sem
                burocratizar a experiência.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <SiteCard
                icon={<MessageSquareText className="w-5 h-5 text-primary" />}
                title="Comunicação"
                description="Avisos e alinhamentos mais claros entre escolinha, projeto e família."
              />
              <SiteCard
                icon={<CalendarClock className="w-5 h-5 text-primary" />}
                title="Histórico"
                description="Uma visão construída ao longo do tempo, com rotina e acompanhamento."
              />
              <SiteCard
                icon={<Users className="w-5 h-5 text-primary" />}
                title="Organização"
                description="Informações mais organizadas por turma, treino e contexto."
              />
              <SiteCard
                icon={<ShieldCheck className="w-5 h-5 text-primary" />}
                title="Seriedade"
                description="Mais transparência no dia a dia, com foco em consistência e responsabilidade."
              />
            </div>
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection variant="muted">
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Privacidade e segurança</h2>
              <p className="mt-3 text-slate-600">
                A base envolve dados de crianças e famílias. Levamos proteção de dados a sério, com acesso por perfis e
                finalidades claras para uso de informações.
              </p>
              <div className="mt-6">
                <Link to="/privacidade" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Política de Privacidade
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="font-semibold text-slate-900">Dúvidas comuns</p>
              <p className="mt-2 text-sm text-slate-600">
                Reunimos respostas por categoria para pais, atletas, escolinhas e privacidade.
              </p>
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
            title="Precisa falar com a equipe?"
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
