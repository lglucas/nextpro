import { Link } from 'react-router-dom'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'
import { SiteCard } from '@/features/site/components/SiteCard'
import { PreCadastroWizard } from '@/features/preCadastro/components/PreCadastroWizard'

export function PreCadastroPage() {
  const { user } = useAuth()

  return (
    <div>
      <SiteHero
        eyebrow="Pré‑cadastro"
        title="Pré‑cadastro por convite"
        description="Se você recebeu este link da sua escolinha, é porque faz parte do processo de organização do projeto. O objetivo é coletar informações com responsabilidade e clareza."
      >
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login?returnTo=%2Fpre-cadastro"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/register?returnTo=%2Fpre-cadastro"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
            >
              Criar acesso
            </Link>
          </div>
        ) : null}
      </SiteHero>

      <SiteSection variant="muted">
        <SiteContainer>
          {user ? (
            <div className="mb-8">
              <PreCadastroWizard />
            </div>
          ) : null}

          <div className="grid md:grid-cols-2 gap-4">
            <SiteCard
              icon={<Sparkles className="w-5 h-5 text-primary" />}
              title="Como funciona"
              description="Você cria seu acesso, confirma o email e preenche o formulário. Depois, sua escolinha faz a validação e você recebe uma confirmação."
            />
            <SiteCard
              icon={<ShieldCheck className="w-5 h-5 text-primary" />}
              title="Privacidade"
              description="Dados são coletados com finalidade definida e acesso controlado por perfis. Para detalhes, consulte a Política de Privacidade."
              footer={
                <Link to="/privacidade" className="text-sm text-primary font-semibold hover:underline">
                  Política de Privacidade
                </Link>
              }
            />
          </div>
        </SiteContainer>
      </SiteSection>
    </div>
  )
}
