import { Link } from 'react-router-dom'
import { SiteCallout } from '@/features/site/components/SiteCallout'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteAuthCtaButton } from '@/features/site/components/SiteAuthCtaButton'

export function HomeContactSection() {
  return (
    <SiteSection>
      <SiteContainer>
        <SiteCallout
          title="Contato institucional"
          description="Quer falar com a equipe NextPro? Use o canal institucional para dúvidas e alinhamentos."
          actions={
            <>
              <Link
                to="/contato"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
              >
                Falar com a equipe
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
  )
}
