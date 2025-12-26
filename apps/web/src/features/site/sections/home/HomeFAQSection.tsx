import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'

export function HomeFAQSection() {
  return (
    <SiteSection variant="muted">
      <SiteContainer>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900">Dúvidas comuns</h2>
          <p className="mt-2 text-slate-600">Algumas respostas rápidas. No FAQ você encontra tudo por categoria.</p>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-4">
          <SiteCard
            title="Como as famílias acessam?"
            description="O acesso é orientado pelas escolinhas participantes e pelo projeto, com comunicação e convites adequados."
          />
          <SiteCard
            title="O que vou encontrar por aqui?"
            description="Uma visão institucional do projeto e o caminho dentro do ecossistema (pais, atletas e escolinhas)."
          />
          <SiteCard
            title="Como falar com a equipe?"
            description="Use o canal institucional para dúvidas e alinhamentos."
            footer={
              <Link to="/contato" className="text-sm text-primary font-semibold hover:underline">
                Contato
              </Link>
            }
          />
        </div>

        <div className="mt-8">
          <Link to="/faq" className="inline-flex items-center text-primary font-semibold hover:underline">
            Ver FAQ completo <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </SiteContainer>
    </SiteSection>
  )
}

