# Manual Completo — Engines NextPro (Técnica, Social e Benefícios)

Este documento descreve, de ponta a ponta, o desenho completo das 3 engines do NextPro (Técnica, Social e Benefícios), com regras, objetivos, entidades, fluxos, anti-fraude, governança e saídas (rankings + perfil do atleta), de forma que uma equipe consiga implementar o produto apenas com base neste texto.

As decisões abaixo consolidam as conversas recentes e os arquivos:
- [respondendo.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/respondendo.md)
- [respondendo2.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/respondendo2.md)
- Ideia originária (BP2): [nextpro_bp2_ideia_originaria.html](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/nextpro_bp2_ideia_originaria.html)

---

## 1) Visão Geral: os 3 sistemas (separados e integráveis)

O NextPro tem 3 engines independentes, cada uma com objetivo, público e modelo de receita:

1) **Engine Técnica (Pontos de Futebol)**  
Objetivo: medir evolução técnica do atleta e suportar seleção para núcleos/peneirões e venda de informação para scouts/clubes.

2) **Engine Social (Pontos Sociais — Influência Econômica)**  
Objetivo: criar um ranking de influência monetizável (fanbase + presentes no feed), com tiers e progressão estilo TikTok; suportar “vaga social” para peneirões.

3) **Engine de Benefícios (Pontos de Benefícios — Fidelidade/Marketplace)**  
Objetivo: fidelidade, cashback e consumo no marketplace (pontos como “moeda”); é o 3º canal de monetização.

Princípio obrigatório: **as engines não podem conflitar**.
- Técnica mede futebol e qualidade esportiva.
- Social mede influência/valor econômico do atleta (separado da técnica).
- Benefícios mede consumo/retorno econômico no marketplace.

Elas podem se tocar apenas em integrações explícitas e auditáveis (ex.: parte do gasto no social vira cashback no marketplace).

---

## 2) Governança temporal: temporadas e ciclos

### 2.1 Temporada (ano)
- A unidade principal de histórico e comparabilidade é a **temporada anual**: 2026, 2025, etc.
- As 3 engines mantêm histórico por temporada e podem **resetar por temporada**.

### 2.2 Ciclo social de 15 dias (tiers)
- A engine social tem um **ciclo de 15 dias** para reavaliar e subir/descer nos tiers (percentual).
- O ciclo **não zera a pontuação**; ele recalcula o posicionamento no tier.
- O reset (se existir) é no **fim da temporada**, alinhado com o ano vigente.

---

## 3) Camada comum (shared): entidades e auditoria

As 3 engines compartilham um núcleo de entidades para consistência, segurança e relatórios:

### 3.1 Pessoas e papéis
- Atleta (criança)
- Responsável (pai/mãe)
- Técnico/Professor da escolinha
- Scout
- Equipe NextPro (núcleo / olheiros)
- Clube (representantes)
- Fanbase (usuários apoiadores vinculados a um atleta por “fan”)

### 3.2 Estrutura operacional
- Organizações, escolinhas, turmas
- Núcleo (agrupamento operacional de 3–4 escolinhas)
- Sessão de treino (aula/treino em um dia/horário para uma turma)

### 3.3 Eventos e evidências
Toda ação que gera score deve virar um evento auditável:
- Quem fez
- Em qual contexto
- Quando
- Evidências (quando aplicável): presença, vínculo, GPS/horário, etc.

### 3.4 Segurança e LGPD (essencial, pois são menores)
- Separação estrita de acesso por papel/organização/escola.
- Dados sensíveis (menores) devem ter proteção extra e consentimentos claros.
- Clubes devem ver o necessário para decisão, sem expor dados sensíveis.

---

## 4) Engine Técnica (Futebol) — regras e fluxos

### 4.1 Objetivo e saídas
Saídas obrigatórias:
- Ranking por núcleo
- Ranking por escolinha
- Ranking por turma
- Tudo repercutindo no perfil do atleta e no “card estilo EA FC” (posição primária)

Também deve existir uma tela de “estatísticas completas” por temporada/ano:
- evolução de skills
- mudanças de posição secundárias (histórico)
- trilhas de avaliação (quem avaliou e quando) para staff

### 4.2 Posição primária (EA FC card)
Decisão:
- O card principal usa **posição primária**.
- Posição primária é definida automaticamente por **frequência**.

Fonte de frequência:
- o atleta informa no pós-treino (auto-relato de posição do treino).
- o técnico pode confirmar/ajustar a posição em fluxo guiado quando fizer a avaliação do treino (opcional, mas previsto no desenho).

### 4.3 Coleta de dados técnica (3 camadas de input)

#### 4.3.1 Presença (automático)
Presença é sinal operacional e base de consistência.
Estado atual do produto (já implementado): XP por presença com trigger e progressão.

#### 4.3.2 Avaliação por treino (diária, obrigatória)
Fluxo obrigatório por treino:
1) Técnico seleciona **3 piores** (obrigatório).
2) O sistema exige responder as avaliações dos 3 piores.
3) Só então libera seleção de **3 melhores** (obrigatório).
4) Técnico avalia os 3 melhores e salva.

Formato das perguntas (por atleta selecionado, por treino):
- **3 perguntas por atleta**, todas numéricas 0–10.
- As perguntas são escolhidas como “iFood de molhos”, para reduzir atrito:
  - Pergunta 1 (base): o técnico escolhe 1 pergunta dentro de um menu de 5 perguntas base.
  - Perguntas 2 e 3 (por posição): o técnico escolhe 1 pergunta por vez dentro de menus de 5 perguntas compatíveis com a posição primária (ou posição sugerida pelo sistema naquele treino, com possibilidade de ajuste).

Decisão:
- Não existe opção “não avaliei”; é obrigatório.

#### 4.3.3 Prova mensal (20–40 perguntas por atleta)
Ao final do mês (por turma):
- O técnico responde um questionário completo **por atleta**.
- São 20–40 perguntas por atleta, mas o banco total de perguntas pode ser maior devido a variações por posição.

Decisão:
- Rubrica deve ser fixa/versionada para comparabilidade histórica.

### 4.4 Multi-fontes e camadas de confiança (A–D)
O objetivo é cruzar dados de várias fontes, com pesos e reputação:

- **Camada A (alta confiança):** Equipe NextPro (núcleo/peneirão) e NextPro como olheiro em visita a treino.
- **Camada B (média):** dados operacionais de baixa fraude (presença, consistência, evidências).
- **Camada C (baixa):** escolinha/técnico (obrigatório e guiado) e auto-relato do atleta.
- **Camada D (contexto):** socioeconômico/escolar (não entra como técnica; é contexto para seleção e produto).

### 4.5 Reputação do avaliador + punição silenciosa (“Pinóquio”)
O sistema deve manter um score interno por avaliador (técnico, scout, etc.) e aplicar punições silenciosas:
- divergência recorrente contra o “ground truth” da NextPro (quando houver sobreposição)
- detecção de anomalias (padrões suspeitos, extremos, repetição)
- denúncias e auditoria humana

Punição:
- redução gradual de peso (shadow ban de influência, sem aviso ao usuário)
- flags operacionais

### 4.6 Scouts: cursos e níveis (5 níveis)
Decisão:
- Scout tem 5 níveis; o nível altera o **peso** das avaliações.
- Acesso a funcionalidades pode ser vendido em pacotes pagos (separado do peso).

Anti-fraude de scout (obrigatório no desenho):
- evidência mínima (GPS + horário + presença): o scout só vê/alcança uma turma se estiver no local/horário e só pode avaliar atletas que marcaram presença naquele treino.

### 4.7 Seleção para núcleo/peneirão (por evento)
Decisão:
- Seleção é por evento (peneirão), sem período fixo.
- A equipe NextPro usa os rankings, mas decide o que quiser (liberdade humana).

---

## 5) Engine Social (Influência Econômica) — regras e fluxos

### 5.1 Objetivo e saída
O social mede influência monetizável:
- presentes no feed (moedas)
- fanbase vinculada ao atleta
- ranking com tiers e progressão

Uso estratégico:
- formar “vitrine” para clubes (separado da técnica)
- gerar “vaga social” para peneirão: top 10 do tier mais alto; NextPro escolhe 2 ou mais (ou todos) a critério do time

### 5.2 Duas trilhas: pago e orgânico (com cap no orgânico)
Decisão:
- Separar o score social em:
  - **Trilha Paga**: presentes/reactions compradas com moedas (sem cap ou cap alto).
  - **Trilha Orgânica**: ações gratuitas (com cap) para não virar só pay-to-win.

Sugestão operacional (para implementação):
- `score_social_total = score_pago + min(score_organico, cap_organico_por_periodo)`
- O cap pode ser por dia/semana/ciclo, conforme estratégia anti-fraude.

### 5.3 Moedas e presentes no feed (sem live)
Decisões:
- O app terá feed estilo Instagram (sem lives).
- Presentes e reações no feed são monetizados via moedas.
- Para comprar moedas: exigir verificação com telefone e CPF no pagamento.
- Qualquer pessoa pode ser fanbase, desde que verificada.

### 5.4 “Seguir” vs “Ser fã”
Decisão:
- Seguir: gratuito; define o feed do usuário.
- Ser fã: vínculo explícito com um atleta; habilita contribuição “de fanbase”.

Regras:
- O usuário pode seguir quantos quiser.
- “Curtir grátis”: 1 curtida por postagem.
- Se quiser “curtir mais” ou usar recursos premium, compra moedas e usa presentes.

### 5.5 Fanbase: convite, troca de atleta e cooldown progressivo
Decisões:
- Cada atleta/responsável tem link de convite para criar fanbase.
- Um apoiador pode trocar de atleta quantas vezes quiser.
- Cooldown progressivo por troca:
  - 1ª troca: 7 dias
  - 2ª: 15 dias
  - 3ª: 30 dias
  - depois repete 30 dias

Pontos e justiça:
- Pontos gerados enquanto fã do atleta X ficam no atleta X.
- Ao mudar de atleta, o “contador de contribuição” para o novo atleta inicia do zero.

### 5.6 Tiers estilo TikTok por percentil (com subtiers)
Decisão:
- Tiers são calculados por percentil e atualizados a cada 15 dias.
- Subtiers (ex.: F5 → F4 → … → A1) podem existir para dar progressão granular.

### 5.7 Cashback para o marketplace (integração Social → Benefícios)
Decisão:
- Parte do gasto em moedas pode virar cashback.
- Esse cashback deve ser gasto no marketplace (engine de benefícios), integrando monetização social com fidelidade.

---

## 6) Engine de Benefícios (Fidelidade/Marketplace) — regras e fluxos

### 6.1 Objetivo
Engine para:
- pontos de fidelidade e cashback
- incentivos de consumo
- canal de monetização com parceiros e marketplace

Decisão:
- Engine de benefícios é o 3º sistema e pode ser tratada como “moeda”.
- Possibilidade futura: token/Blockchain, sem impacto na implementação atual (não é requisito de MVP).

### 6.2 Integração com Social
Integrações permitidas:
- cashback do social alimenta saldo de benefícios no marketplace.

Regra importante:
- benefícios não devem alterar score técnico.

---

## 7) Clubes: assinatura mensal + catálogo de itens avulsos

### 7.1 Princípio
Clube paga para ter **melhor acesso e eficiência de prospecção**, não para “mudar a nota do atleta”.

### 7.2 Assinatura (3 níveis)
Níveis são mensais e com valor crescente; a diferença é acesso/limites/qualidade de relatório.
- Base
- Pro
- Elite

### 7.3 Itens avulsos (10–15 produtos)
Decisão:
- Ter um catálogo grande de avulsos (10 a 15 itens).

Exemplos de categorias (não é lista fechada):
- relatórios extras e comparativos avançados
- acesso a “pacotes por núcleo” (data room)
- alertas premium e shortlist
- acesso a eventos/peneirões específicos
- pedidos de “introdução”/contato mediado pela NextPro (operacional)

---

## 8) Flags e governança operacional (escolinhas)

Decisão:
- Escolinha precisa ter governança por colaboração.
- Regra proposta: 3 meses seguidos sem responder formulários (mensais) avança 1 flag, dentro de um total de 5 flags, caminhando para descredenciamento.

O sistema deve manter:
- contador de inadimplência operacional
- histórico de flags por temporada
- status da escolinha (ativa / sob observação / suspensa)

---

## 9) Estado atual no repositório (v0.6.17) — o que já existe

Hoje, no código, existe uma base inicial de gamificação ligada à presença:
- XP por presença via trigger em `attendances`
- tabela de progresso e eventos (idempotência)
- infra mínima de badges/tiers
- UI de level e card básico no perfil

Documento fiel ao código: [explicacao-engine-gamificacao-v0.6.17.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/explicacao-engine-gamificacao-v0.6.17.md)

---

## 10) Checklist de implementação (alto nível)

Para construir as 3 engines de forma consistente:
- Modelar entidades comuns (temporada, núcleo, sessão de treino, roles, evidências, eventos)
- Criar catálogo versionado de rubricas/perguntas por posição (técnico)
- Implementar fluxo diário do técnico com “gating” (3 piores → 3 melhores) e seleção tipo iFood
- Implementar prova mensal por turma/aluno (20–40 perguntas por aluno)
- Implementar reputação e pesos por fonte (A–D) + Pinóquio (shadow ban)
- Implementar social: moedas, presentes no feed, fanbase com cooldown, tiers por percentil e ciclo 15 dias
- Implementar cashback social → benefícios + marketplace/pontos de fidelidade
- Implementar produtos para clubes (assinaturas + 10–15 avulsos), com RBAC e auditoria

---

## 11) Decisões operacionais ainda a formalizar (para não travar a construção)

Estas decisões não impedem iniciar o desenho, mas precisam estar explícitas no planejamento:
- Fórmula exata do tier social: usar deltas do ciclo de 15 dias, total da temporada, ou combinação dos dois.
- Regras finais do cap orgânico (por dia vs por ciclo; limites por tipo de ação).
- Percentis dos tiers e quantos subtiers existirão.
- Política de cashback: percentual por compra, limites, e se depende do tier do atleta.

