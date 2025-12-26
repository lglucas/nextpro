import { Link } from 'react-router-dom'
import { Bell, ClipboardList, LayoutGrid, Users } from 'lucide-react'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'
import { SiteCard } from '@/features/site/components/SiteCard'
import { SiteCallout } from '@/features/site/components/SiteCallout'
import { SiteAuthCtaButton } from '@/features/site/components/SiteAuthCtaButton'

export function EscolinhasPage() {
  return (
    <div>
      <SiteHero
        eyebrow="Para Escolinhas"
        title="Gestão padronizada, comunicação mais clara e dados consistentes."
        description="Sem perder o que importa: o treino e a evolução do atleta. O NextPro organiza a operação para que a rotina gere histórico e contexto ao longo do tempo."
      />

      <SiteSection>
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Um padrão único para o dia a dia</h2>
              <p className="mt-3 text-slate-600">
                Quando cada escolinha trabalha com um padrão diferente, a rotina vira ruído. O NextPro traz uma forma comum de
                organizar turmas, presença, comunicados e acompanhamento — preservando a essência do treino.
              </p>
              <p className="mt-3 text-slate-600">
                Com dados mais consistentes, o ecossistema ganha contexto: melhora o diálogo com famílias e fortalece a
                seriedade do processo de evolução, observação e acompanhamento.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <SiteCard
                icon={<LayoutGrid className="w-5 h-5 text-primary" />}
                title="Organização"
                description="Turmas, alunos e estrutura por unidade, com rotina clara."
              />
              <SiteCard icon={<Users className="w-5 h-5 text-primary" />} title="Presença" description="Registro de presença e contexto do treino como base do histórico." />
              <SiteCard
                icon={<Bell className="w-5 h-5 text-primary" />}
                title="Comunicados"
                description="Comunicação mais direta, com menos ruído e mais previsibilidade."
              />
              <SiteCard
                icon={<ClipboardList className="w-5 h-5 text-primary" />}
                title="Acompanhamento"
                description="Rotina registrada ao longo do tempo, com mais consistência."
              />
            </div>
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection variant="muted">
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Convite às famílias</h2>
              <p className="mt-3 text-slate-600">
                O pré‑cadastro é entregue às famílias por convite da própria escolinha. É um passo importante para organizar o
                contexto socioeconômico e estruturar o relacionamento com pais e responsáveis.
              </p>
              <p className="mt-3 text-slate-600">
                A página de pré‑cadastro não aparece no menu público. Ela é usada pelos gestores para distribuir diretamente
                aos pais.
              </p>
              <div className="mt-6">
                <Link to="/faq" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Ver dúvidas de escolinhas
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary">Implantação</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Operação orientada pelo projeto</h3>
              <p className="mt-3 text-slate-600">
                O padrão de implantação e operação é definido pelo projeto. A plataforma existe para dar previsibilidade e
                consistência, reduzindo retrabalho e alinhando a rotina entre as escolinhas.
              </p>
            </div>
          </div>
        </SiteContainer>
      </SiteSection>

      <SiteSection>
        <SiteContainer>
          <SiteCallout
            title="Quer falar sobre implantação?"
            description="Use o canal institucional para dúvidas e alinhamentos com a equipe NextPro."
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
