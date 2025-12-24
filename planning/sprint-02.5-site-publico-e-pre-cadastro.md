# Sprint 2.5 — Site Público (Institucional) + Pré-Cadastro (Censo Familiar)

## 1. Objetivo do site

Criar um site institucional completo (multi-páginas) para a marca **NextPro**, comunicando o projeto **Reglobo Soccer** e explicando como a plataforma funciona para pais, atletas e escolinhas, com um posicionamento “micro‑SaaS institucional” (sem seção de planos/preços e sem venda aberta).

O site público fica em `https://nextpro.app.br/`.

A plataforma (app) será movida posteriormente para um subdomínio, por exemplo `https://app.nextpro.app.br/`, e deve permanecer protegida por autenticação.

O site deve ter botão “Entrar” levando ao login da plataforma.

## 2. Proposta de valor (texto-base para o site)

Proposta de valor sugerida (baseada nos documentos do projeto e no posicionamento informado):

- **Para famílias:** transparência e acompanhamento da jornada do atleta na base, com organização e comunicação mais claras.
- **Para escolinhas:** padronização e digitalização do dia a dia, com dados estruturados que facilitam gestão, retenção e evolução.
- **Para o projeto:** transformar 13 anos de operação e histórico em um ambiente digital confiável, conectado e escalável.

Frase curta sugerida para o topo do site:
- “O futuro do esporte começa na base — com organização, dados e transparência.”

## 3. Restrições (importantes)

- Não haverá páginas de “Planos”, “Preços”, “Contratar”, “Comprar”, nem linguagem de venda de SaaS para o público externo.
- O site é institucional e informativo: o app é usado pelas escolinhas já conectadas ao projeto.
- Conteúdo deve ser sóbrio, com linguagem clara para pais e atletas, e com uma seção específica para escolinhas (gestores/professores).
- Haverá uma rota de pré-cadastro “sem link no menu”, usada pelos pais via convite dos gestores.

## 4. Arquitetura de páginas (mapa do site)

### 4.1 Navegação principal (menu)

- Home (`/`)
- Projeto / Sobre (`/projeto`)
- Para Pais (`/pais`)
- Para Atletas (`/atletas`)
- Para Escolinhas (`/escolinhas`)
- Como Funciona (`/como-funciona`)
- FAQ (`/faq`)
- Contato (`/contato`)
- Entrar (CTA → leva ao login da plataforma)

### 4.2 Rodapé (sempre presente)

- Termos de Uso (`/termos`)
- Privacidade (`/privacidade`)
- Blog / Notícias (`/blog`) com estado “Em breve”
- Parceiros (`/parceiros`) com estado “Em breve”
- Redes sociais e dados institucionais (a definir)

### 4.3 Páginas “sem link no menu” (rota escondida)

- Pré‑Cadastro (Wizard / Censo): `/pre-cadastro`

## 5. Estrutura detalhada por página (seções sugeridas)

### 5.1 Home (`/`)

Objetivo: apresentar o NextPro como ferramenta do projeto Reglobo Soccer, com credibilidade e impacto, e guiar o visitante para páginas de persona.

Seções:
- Hero: mensagem principal + “Entrar” + “Saiba mais”
- O que é o NextPro (2–3 parágrafos institucionais)
- O que é o projeto Reglobo Soccer (contexto resumido)
- Números de impacto (contadores): 13 anos, 12 estados, 38.114 atletas avaliados, 10–12 escolinhas prontas para digitalização (inicialmente estático; no futuro conectado à plataforma com dados reais)
- Para quem é (cards): Pais, Atletas, Escolinhas, Scouts/Clubes (mais discreto)
- Como funciona (resumo em 4 passos com link para `/como-funciona`)
- FAQ curto (3–5 perguntas) com link para `/faq`
- Contato (CTA institucional)

### 5.2 Projeto / Sobre (`/projeto`)

Objetivo: explicar a história, missão, visão e o porquê do projeto existir.

Seções:
- História e contexto (Reglobo Soccer: 13 anos de operação; NextPro: camada de digitalização e padronização)
- Missão e visão (baseado nos documentos)
- Benefícios a partir daqui (dados e evolução diária no dia a dia do atleta, gamificação e visibilidade com mais seriedade para conversas futuras com scouts e clubes)
- Impacto social (esporte e escolarização; abordar com cuidado e respeito)
- Credibilidade e parcerias (sem “vender”; apenas institucional; pode ter “Em breve” para logos)

### 5.3 Para Pais (`/pais`)

Objetivo: explicar o que os pais terão de clareza/organização (sem promessas de “carreira garantida”).

Seções:
- O que os pais acompanham (exemplos de informações)
- Comunicação e organização (rotina, avisos, calendário)
- Transparência com dados (linguagem simples)
- Privacidade e segurança (resumo do compromisso, com link para `/privacidade`)
- CTA: “Entrar” e “Tirar dúvidas”

### 5.4 Para Atletas (`/atletas`)

Objetivo: falar com o atleta e com o pai, com tom motivacional porém sóbrio.

Seções:
- Jornada de evolução (treinos, presença, evolução)
- Reconhecimento e rotina (sem exagero; sem “gamificação agressiva”)
- Como você participa (convite pela escolinha)

### 5.5 Para Escolinhas (`/escolinhas`)

Objetivo: apresentar uma gestão eficiente e padronizada entre escolinhas, melhorando a organização, a comunicação e a qualidade do fluxo de dados do dia a dia.

Seções:
- O que é digitalizado (cadastros, turmas, presença, comunicados)
- Operação e governança (organização por unidade/turma)
- Suporte e implantação (explicar o fluxo de habilitação)
- Como convidar pais (explicar o link de pré‑cadastro)
- CTA: “Entrar” (para gestores) e “Contato”

### 5.6 Como Funciona (`/como-funciona`)

Objetivo: explicar o fluxo ponta a ponta (pais ↔ escolinha ↔ plataforma).

Seções:
- Visão geral em passos
- Convites e acesso
- Pré‑cadastro (explicar que ocorre por convite)
- Validação pela escolinha (aprovação/confirmação)
- Visão global do ecossistema dentro da plataforma (escolinhas, equipe técnica NextPro, scouts e representantes de clubes)

### 5.7 FAQ (`/faq`)

Objetivo: reduzir suporte e dúvidas.

Estrutura:
- Perguntas por categoria: Pais, Atletas, Escolinhas, Privacidade/Segurança
- Meta de conteúdo: 10–20 perguntas por categoria
- “Não encontrou?” → Contato

### 5.8 Contato (`/contato`)

Objetivo: canal institucional.

Seções:
- Formulário de contato simples
- Email institucional e WhatsApp (se aplicável)
- Localização/cidade (se aplicável)

### 5.9 Termos (`/termos`) e Privacidade (`/privacidade`)

Objetivo: páginas institucionais no rodapé.

Conteúdo:
- Estrutura inicial (resumo do que será coletado e para quê)
- Observação de que contratos e autorizações específicas (ex.: imagem) serão formalizados em etapa posterior, quando a plataforma for lançada para pais

### 5.10 Blog (`/blog`) e Parceiros (`/parceiros`)

Objetivo: páginas “Em breve” com estrutura pronta.

## 6. Pré‑cadastro / Censo Familiar (rota escondida)

### 6.1 URL e acesso

- URL pública: `https://nextpro.app.br/pre-cadastro`
- O link é distribuído pelos gestores das escolinhas para os pais.
- O acesso ao censo deve exigir conta (pré‑cadastro) com confirmação de email.

### 6.2 Separação de ambiente (não misturar com a plataforma)

Requisito: contas de pais criadas para o pré‑cadastro não podem se misturar com contas operacionais da plataforma no mesmo “ambiente” lógico.

Planejamento sugerido (a ser validado na implementação):
- Manter o mesmo provedor de Auth, mas separar usuários por um atributo de estado/segmento no `profiles`, por exemplo:
  - `account_stage = 'pre_cadastro' | 'ativo'`
  - `account_source = 'pre_cadastro' | 'gestor' | 'admin' | ...`
- O dashboard/admin deve listar e gerenciar esse grupo separadamente.
- O pré‑cadastro deve gravar dados em tabelas dedicadas (não misturar com tabelas operacionais da plataforma).

### 6.3 Fluxo de entrada (proposto)

1) Pai abre `/pre-cadastro`  
2) Se não estiver logado:
   - Tela de “Criar acesso” (nome, email, whatsapp)
   - Confirmação de email obrigatória
3) Após confirmar email:
   - Redireciona automaticamente para o Wizard do Censo
4) Ao finalizar:
   - Salvar no Supabase (tabelas de pré‑cadastro dedicadas)
   - Registrar metadata (data/hora, IP, geolocalização aproximada se disponível, user agent)
   - Enviar email caloroso de confirmação ao pai
   - Notificar equipe (admins/CTO) por email

### 6.4 Captcha anti‑spam

Requisito: adicionar captcha (preferencialmente invisível) antes do envio final do censo e/ou no passo inicial de criação de conta.

### 6.5 Wizard — etapas e regras

Princípios:
- UX extremamente simples, linguagem humana, validações amigáveis
- Permitir adicionar filhos dinamicamente (limite técnico: 8)
- Diferenciar “filhos na escolinha” vs “outros filhos na família”
- Perguntas sensíveis: “opcional, mas recomendado”
- Consentimento explícito somente no final

Etapas sugeridas:

**Etapa 0 — Acesso (pré‑cadastro do pai)**
- Nome completo
- Email
- WhatsApp
- Confirmação de email (obrigatória)

**Etapa 1 — Responsável**
- CPF
- Endereço completo (CEP, rua, número, bairro, cidade, UF)
- Permissão para usar localização do dispositivo (opcional)
- Captura de IP automaticamente (server-side)

**Etapa 2 — Escolinha (referência)**
- Campo de busca com autocomplete (base `schools` do Supabase) por:
  - Nome da escolinha
  - Cidade/UF
- Se não encontrar:
  - Cadastro rápido de escolinha: Nome + Cidade + UF
- Regra: normalização futura para deduplicação (merge posterior, não bloqueia)

**Etapa 3 — Filhos (estrutura dinâmica)**
- Bloco “Filhos que treinam na escolinha”
  - Adicionar 1..8
  - Para cada filho: nome, data de nascimento, gênero, posição
  - Série escolar e escola onde estuda
- Bloco “Outros filhos (não treinam na escolinha)”
  - Cadastro individual por filho (opcional), também com limite total de 8 filhos

**Etapa 4 — Pesquisa socioeconômica**
- Renda familiar (faixas)
- Composição familiar (quem mora na casa)
- Escolaridade do responsável
- Ocupação do responsável
- Acesso à internet (sim/não, tipo)
- Transporte até a escolinha (meio, tempo aproximado)
- Benefícios sociais (opcional, mas recomendado)
- Campos extras sugeridos:
  - Quantas pessoas contribuem com renda
  - Situação de moradia (própria/alugada/cedida)
  - Principal desafio para manter a criança no esporte (opcional)
  - Plano de saúde (faixas: não / sim — básico / sim — completo)
  - Poupança e investimentos (faixas: não / sim — pouco / sim — moderado / sim — alto)
  - Bens e eletrodomésticos (faixas por item: 0 / 1 / 2+)
  - Acesso a atividades extracurriculares (faixas: não / às vezes / regularmente)
  - Objetivo principal da família com o esporte (opcional, múltipla escolha)
  - Tempo disponível para acompanhar a rotina do atleta (faixas)

**Etapa 5 — Consentimento e envio**
- Checkbox de aceite (LGPD + finalidade do uso)
- Registro de data/hora/IP
- Enviar

### 6.6 Dados técnicos a registrar (para BI futuro)

Capturar e armazenar:
- Timestamp de criação e envio
- IP, user agent, idioma do navegador
- Geolocalização aproximada (se permitido pelo usuário; sempre opcional)
- `school_reference` (id ou “cadastro livre”)
- Estrutura de filhos (com flags: “treina na escolinha”)
- Metadados para deduplicação de escolinha:
  - `school_name_raw`, `school_city`, `school_uf`
  - `school_name_normalized` (planejado para etapa posterior)

## 7. Validação pela escolinha (fluxo futuro)

Requisito de produto (próxima fase):
- Criar uma área dedicada para professores/gestores onde eles veem:
  - pais/alunos que referenciaram a escolinha
  - status por cadastro: “Recebido”, “Validado”, “Solicitar ajuste”
- Ao validar:
  - enviar email ao responsável informando que o pré‑cadastro foi reconhecido/confirmado

Termo sugerido no email (em vez de “reconhecidos”):
- “Pré‑cadastro confirmado pela sua escolinha”

## 8. Sugestão de fluxo futuro Pai ↔ Filho (quando lançar a plataforma para famílias)

Objetivo: permitir um fluxo simples e seguro para pessoas com baixa familiaridade digital.

Sugestão:
- O responsável é o “ponto de verdade” (guardian).
- A validação da família acontece pela escolinha, com email de confirmação ao responsável.
- Quando for hora de cadastrar atletas (fase futura):
  - o responsável recebe um aviso grande dentro da plataforma e um email com botão “Cadastrar seus filhos”
  - nessa tela, o responsável gera um link e um código temporário (expira em 7 dias) para compartilhar com o atleta via WhatsApp
  - o atleta se cadastra via link ou informando o código
  - fallback: caso o atleta tente se cadastrar sem link/código, o sistema tenta vincular se houver cruzamento simultâneo (nome do atleta e nome do responsável já cadastrados no pré‑cadastro)

## 9. Métricas e indicadores (para o site e para BI)

Site (institucional):
- Visitas por página (pais/atletas/escolinhas)
- Cliques em “Entrar”
- Conversão em pré‑cadastro (quando link for usado)
- Cliques por persona (Pais/Atletas/Escolinhas)
- Taxa de rejeição por página e tempo médio
- Conversão “Contato” (envios do formulário)
- Origem do tráfego (UTM por escolinha/cidade)

Pré‑cadastro (BI):
- Cadastros por escolinha/cidade/UF
- Cadastros por núcleo (agrupamento operacional)
- Perfil demográfico (idade, série escolar, gênero)
- Distribuição por posição (auto‑relato)
- Distribuição por escola (onde estuda) e série
- Renda por região (faixas)
- Transporte e acesso à internet
- Benefícios sociais (faixas)
- Plano de saúde (faixas)
- Investimentos/poupança (faixas)
- Situação de moradia (faixas)
- Percentual de preenchimento completo vs parcial
- Tempo médio de preenchimento do wizard por etapa
- Taxa de abandono por etapa
- Cadastros duplicados de escolinha (potenciais merges)
- Taxa de validação pela escolinha (recebido → validado)

## 10. Mensagens institucionais do produto (sem micro-detalhes)

Objetivo: transformar os conceitos do produto em linguagem institucional pronta para o site, mantendo a visão macro do projeto e evitando explicações operacionais.

### 10.1 Como diferenciar NextPro e Reglobo Soccer

- **Reglobo Soccer**: o projeto e a operação (escolinhas, metodologia, histórico, núcleos, experiência de campo).
- **NextPro**: a plataforma que digitaliza, organiza e padroniza essa operação, com dados estruturados para apoiar decisões com mais consistência.

Texto sugerido (curto, para `/projeto`):
- “A Reglobo Soccer construiu uma história real no campo. O NextPro nasce para levar essa experiência para o digital — com organização, padronização e um histórico de evolução que acompanha o atleta ao longo do tempo.”

### 10.2 Núcleos (visão pública)

- Núcleos são agrupamentos operacionais que reúnem múltiplas escolinhas.
- Em ciclos, alguns atletas podem ser avaliados presencialmente no núcleo pela equipe técnica NextPro, com critérios e metodologia próprios.

Texto sugerido (curto, para `/como-funciona`):
- “Além do dia a dia nas escolinhas, o projeto conta com núcleos: momentos de avaliação e acompanhamento com a equipe técnica NextPro, reforçando consistência e seriedade no processo.”

### 10.3 Histórico robusto (multi-fonte) — explicação “market-friendly”

Posicionamento a ser usado no site:
- “O NextPro combina diferentes sinais do dia a dia para construir um histórico mais consistente do atleta.”
- “Quando há avaliações presenciais do núcleo e avaliações de profissionais credenciados, elas ajudam a qualificar ainda mais o histórico.”

Frases curtas para usar em cards/benefícios (pais e escolinhas):
- “Evolução registrada ao longo do tempo, não por um único dia.”
- “Mais consistência, mais transparência e mais seriedade.”

### 10.4 Participação da escolinha (linguagem institucional)

O que dizer (sem entrar em mecanismo):
- “As escolinhas registram destaques e pontos de atenção do treino, de forma objetiva, criando uma rotina de acompanhamento.”
- “Há também ciclos de avaliação mais completos por turma, para consolidar a visão do mês.”
- “A plataforma prioriza consistência e qualidade de dados, para que o histórico seja confiável ao longo do tempo.”

Texto sugerido para `/escolinhas`:
- “Uma rotina simples de registro torna o acompanhamento mais claro para a equipe e para as famílias — e ajuda a padronizar a evolução em todas as escolinhas do projeto.”

### 10.5 Autoavaliação diária do atleta (sem promessas)

Como comunicar:
- “O atleta participa registrando o contexto do treino e sua percepção diária.”
- “Ao longo do tempo, isso ajuda a construir disciplina, rotina e um histórico mais completo.”

Texto sugerido para `/atletas`:
- “Sua evolução não é um palpite. É um histórico — treino após treino.”

### 10.6 Scouts e representantes de clubes (sem explicar regras internas)

Como comunicar:
- “A plataforma também organiza o fluxo de avaliação com profissionais credenciados, criando mais visibilidade e estrutura para conversas futuras.”
- “Avaliações externas são feitas com contexto do treino e presença confirmada, reforçando integridade do processo.”

Texto sugerido para `/como-funciona`:
- “Com uma base organizada, o diálogo com scouts e representantes de clubes acontece com mais contexto, clareza e seriedade.”

### 10.7 Rascunhos prontos para usar no site (copy base)

**Home (hero)**
- Título: “O futuro do esporte começa na base.”
- Subtítulo: “NextPro é a plataforma que digitaliza a operação da Reglobo Soccer — para dar mais organização, consistência e transparência ao dia a dia.”

**Projeto / Sobre**
- “Uma operação real no campo. Uma plataforma para organizar e evoluir no digital.”

**Para Pais**
- “Você acompanha a jornada com mais clareza: organização, rotina e um histórico construído no dia a dia.”

**Para Escolinhas**
- “Gestão padronizada, comunicação mais clara e dados consistentes — sem perder o que importa: o treino e a evolução do atleta.”

**Como Funciona**
- “Escolinhas + Núcleos + Plataforma: um ecossistema conectado, com histórico e consistência ao longo do tempo.”

## 11. Conteúdo e fontes internas (para reescrita institucional)

Base interna a ser usada para redigir o conteúdo do site:
- `project/documento-1-business-plan-estrategico (1).md`
- `project/doc-3-anexos-tecnicos-juridicos-REVISADO (1).md`

## 12. Checklist de entrega do site (quando formos codar)

- Rotas públicas separadas da plataforma
- Menu multi‑páginas + footer com termos/privacidade
- CTA “Entrar” para login
- Página `/pre-cadastro` sem link no menu
- Captcha anti‑spam
- Persistência de rascunho do wizard (não perde progresso)
- Salvamento no Supabase em tabelas dedicadas
- Email para pai e para equipe
