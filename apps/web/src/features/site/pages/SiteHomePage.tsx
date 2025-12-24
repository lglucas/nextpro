import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SiteHero } from '@/features/site/components/SiteHero'
import { SiteAuthCtaButton } from '@/features/site/components/SiteAuthCtaButton'
import { HomeImpactSection } from '@/features/site/sections/home/HomeImpactSection'
import { HomePathsSection } from '@/features/site/sections/home/HomePathsSection'
import { HomeHowItWorksSection } from '@/features/site/sections/home/HomeHowItWorksSection'
import { HomeFAQSection } from '@/features/site/sections/home/HomeFAQSection'
import { HomeContactSection } from '@/features/site/sections/home/HomeContactSection'

export function SiteHomePage() {
  return (
    <div>
      <SiteHero
        eyebrow="NextPro · Reglobo Soccer"
        title="O futuro do esporte começa na base."
        description="NextPro é a plataforma que digitaliza a operação da Reglobo Soccer — para dar mais organização, consistência e transparência ao dia a dia."
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <SiteAuthCtaButton className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors" />
          <Link
            to="/como-funciona"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
          >
            Como funciona <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </SiteHero>
      <HomeImpactSection />
      <HomePathsSection />
      <HomeHowItWorksSection />
      <HomeFAQSection />
      <HomeContactSection />
    </div>
  )
}
