import { Link } from 'react-router-dom'
import { SiteContainer } from '@/features/site/components/SiteContainer'
import { SiteSection } from '@/features/site/components/SiteSection'
import { SiteHero } from '@/features/site/components/SiteHero'

const FAQ_PARENTS = [
  { q: 'Como as famílias acessam?', a: 'O acesso é orientado pelas escolinhas participantes e pelo projeto, por convites e comunicação adequada.' },
  { q: 'O que eu encontro na plataforma?', a: 'Rotina, comunicados e um histórico mais consistente, construído ao longo do tempo.' },
  { q: 'O que muda no dia a dia?', a: 'Menos ruído e mais clareza: informações organizadas, comunicação mais direta e acompanhamento com contexto.' },
  { q: 'Meu filho precisa usar todos os dias?', a: 'A participação é orientada pela escolinha e pelo projeto, com foco em rotina e disciplina.' },
  { q: 'Como o projeto lida com dados sensíveis?', a: 'Tratamos dados com seriedade, finalidade clara e controles de acesso por perfil.' },
  { q: 'Posso atualizar meus dados?', a: 'Sim. Quando a plataforma estiver disponível para famílias, haverá fluxo simples para atualização de cadastro.' },
  { q: 'O que é o pré‑cadastro?', a: 'Um formulário por convite para organizar contexto familiar e apoiar o relacionamento com a escolinha.' },
  { q: 'O que acontece depois do pré‑cadastro?', a: 'A escolinha valida e o responsável recebe comunicações de confirmação e próximos passos.' },
  { q: 'Isso substitui a comunicação da escolinha?', a: 'Não. A plataforma organiza e padroniza, sem tirar a proximidade do dia a dia.' },
  { q: 'Como falar com a equipe?', a: 'Use o canal institucional em Contato para dúvidas e alinhamentos.' },
]

const FAQ_ATHLETES = [
  { q: 'O que significa “histórico” aqui?', a: 'É a evolução construída treino após treino, com contexto e consistência ao longo do tempo.' },
  { q: 'Por que rotina importa tanto?', a: 'Porque a base é feita de consistência. Um bom histórico nasce de disciplina e presença.' },
  { q: 'O que é participação do atleta?', a: 'Registrar contexto e percepção do treino de forma simples, ajudando a construir disciplina.' },
  { q: 'Isso garante oportunidade em clube?', a: 'Não. O objetivo é dar organização e contexto, sem promessas exageradas.' },
  { q: 'O que são núcleos?', a: 'São agrupamentos operacionais do projeto, com momentos de acompanhamento e avaliação com equipe técnica NextPro.' },
  { q: 'Scouts podem ver meu perfil?', a: 'O acesso depende de credenciamento, regras do projeto e permissões adequadas.' },
  { q: 'Posso treinar em mais de uma escolinha?', a: 'O projeto define regras e cadastros. A plataforma registra conforme orientação operacional.' },
  { q: 'Como eu entro na plataforma?', a: 'Por convites e comunicação do projeto e da escolinha.' },
  { q: 'O que faço se tiver problema de acesso?', a: 'Procure sua escolinha ou use o contato institucional.' },
  { q: 'Como acompanho meu progresso?', a: 'Acompanhamento é construído no dia a dia e apresentado com contexto ao longo do tempo.' },
]

const FAQ_SCHOOLS = [
  { q: 'O que muda no dia a dia?', a: 'Organização, presença, comunicados e padronização entre escolinhas do projeto.' },
  { q: 'O que é padronizado?', a: 'Estrutura de turmas, rotinas de presença, comunicados e acompanhamento.' },
  { q: 'A plataforma atrapalha o treino?', a: 'Não. O foco é reduzir burocracia e dar previsibilidade à rotina.' },
  { q: 'Como funciona a implantação?', a: 'A implantação é orientada pelo projeto, com padrão operacional e suporte.' },
  { q: 'Como convidar pais?', a: 'A escolinha distribui o link de pré‑cadastro diretamente às famílias (rota não aparece no menu público).' },
  { q: 'Como lidar com cadastros duplicados de escolinhas?', a: 'O cadastro inicial prioriza velocidade; revisões e ajustes acontecem de forma organizada depois.' },
  { q: 'Quem tem acesso aos dados?', a: 'Acesso por perfil e permissões. Admins gerenciam visões operacionais.' },
  { q: 'Como funciona o fluxo com núcleos?', a: 'A escolinha prepara o atleta; o núcleo reforça acompanhamento e avaliações qualificadas.' },
  { q: 'Existe área para validação de pré‑cadastro?', a: 'Sim, será construída uma área dedicada para revisão e validação por escolinha.' },
  { q: 'Como falar com o time?', a: 'Contato institucional pelo formulário de Contato.' },
]

const FAQ_PRIVACY = [
  { q: 'Como vocês tratam dados?', a: 'Com seriedade e finalidade clara. Veja detalhes na Política de Privacidade.' },
  { q: 'Quais dados são coletados?', a: 'Dados cadastrais e de contexto necessários à operação do projeto, sempre com finalidade definida.' },
  { q: 'Existe consentimento?', a: 'Sim. Fluxos de consentimento são aplicados conforme etapas e necessidades do projeto.' },
  { q: 'Quem pode acessar dados de crianças?', a: 'Acesso controlado por perfis, permissões e regras do projeto.' },
  { q: 'Vocês vendem dados?', a: 'Não. O uso é voltado à operação do projeto e melhoria do acompanhamento.' },
  { q: 'Posso pedir exclusão?', a: 'O canal institucional orienta solicitações conforme políticas aplicáveis.' },
  { q: 'Como ficam contratos e autorizações?', a: 'Autorizações e termos específicos serão formalizados nas etapas adequadas, conforme evolução do projeto.' },
  { q: 'Como é feita a segurança?', a: 'Controles de acesso, boas práticas e revisões constantes para reduzir risco.' },
  { q: 'Há retenção de dados?', a: 'A política será detalhada e aplicada conforme finalidade e requisitos legais.' },
  { q: 'Como faço uma solicitação?', a: 'Use o canal institucional em Contato.' },
]

function FAQSection({
  title,
  items,
}: {
  title: string
  items: Array<{ q: string; a: string }>
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <details key={item.q} className="group rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-900">{item.q}</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

export function FAQPage() {
  return (
    <div>
      <SiteHero
        eyebrow="FAQ"
        title="Perguntas frequentes"
        description="Respostas por categoria. Se não encontrar, fale com a equipe pelo canal institucional."
      />

      <SiteSection variant="muted">
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-6">
            <FAQSection title="Pais" items={FAQ_PARENTS} />
            <FAQSection title="Atletas" items={FAQ_ATHLETES} />
            <FAQSection title="Escolinhas" items={FAQ_SCHOOLS} />
            <FAQSection title="Privacidade e Segurança" items={FAQ_PRIVACY} />
          </div>

          <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div>
              <p className="font-semibold text-slate-900">Ainda com dúvidas?</p>
              <p className="text-sm text-slate-600">Fale com a equipe NextPro.</p>
            </div>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              Contato
            </Link>
          </div>
        </SiteContainer>
      </SiteSection>
    </div>
  )
}
