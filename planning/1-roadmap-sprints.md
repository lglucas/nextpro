# 📅 NextPro - Roadmap de Sprints Detalhado (MVP)

**Versão:** 1.0  
**Data:** 15/12/2025  
**Status:** Aprovado  
**Meta:** MVP Funcional (Web/PWA) em Março de 2026.

---

## 🎯 Visão Geral do Cronograma

| Fase | Período | Sprints | Foco Principal |
|------|---------|---------|----------------|
| **Fase 1** | Dez/25 | 1-2 | **Setup & Alicerce** (Auth, DB, Admin Panel) |
| **Fase 2** | Jan/26 | 3-6 | **Core Loop** (Presença, Avaliação Diária, Gamificação) |
| **Fase 3** | Fev/26 | 7-10 | **Social & Engage** (Feed, Perfil, Bloqueio Financeiro) |
| **Fase 4** | Mar/26 | 11-12 | **Polish & Launch** (Testes, Importação de Dados, Go-Live) |

---

## 🛠️ Detalhamento por Sprint

### 🏁 Sprint 1: O "Hello World" Profissional (15/12 - 21/12)
**Status:** ✅ Concluído (com adiantamentos)
**Objetivo:** Ter o ambiente de desenvolvimento pronto, CI/CD configurado e Banco de Dados estruturado.
- [x] **Setup Monorepo:** Estrutura `apps/web` com scripts NPM e alias `@`.
- [x] **Setup Supabase:** Criar projeto, configurar Auth (Email/Senha + Google) e Storage.
- [x] **Database Schema V1:** Criar tabelas `organizations`, `schools`, `users`, `profiles`.
- [x] **Frontend Skeleton:** Instalar React, Tailwind, Framer Motion e configurar i18n (i18next).
- [ ] **Deploy Inicial:** Configurar Pipeline de Deploy no cPanel (apenas "Hello World"). (Pendente: Aguardando credenciais)

**🚀 Extras Realizados (Adiantamento de Sprints Futuras):**
- **Auth Completo:** Implementadas telas de Login e Registro funcionais (adiantado da Sprint 2/3).
- **RBAC Foundation:** Implementada lógica de Roles (SuperAdmin vs User) e tabela `profiles` com triggers automáticos.
- **Bug Fix:** Migração forçada de Docker para Supabase Cloud devido a instabilidades no ambiente Windows.

### 🏗️ Sprint 2: Gestão de Entidades & Dashboard (22/12 - 28/12)
**Status:** ✅ Concluído (Com funcionalidades avançadas)
**Objetivo:** O SuperAdmin consegue visualizar KPIs globais e gerenciar Escolinhas. Sócios têm visão de leitura.
- [x] **Dashboard Layout:** Sidebar responsiva, Header com perfil e navegação por Roles.
- [x] **BI & KPIs:** Cards de métricas e Widget de Logs reais.
- [x] **Role 'Partner':** Acesso read-only ao Dashboard e relatórios para sócios.
- [x] **Cantinho do CTO:** Área restrita para SuperAdmin com configs avançadas e Logs de Auditoria (Audit Logs).
- [x] **Painel SuperAdmin:** CRUD completo de `Schools` (Escolas) com exportação PDF.
- [x] **Relatórios:** Geração de PDF estilizado para listas de escolas e resumo do dashboard.
- [x] **RBAC (Permissões):** Implementação robusta de Policies RLS e persistência de Role no LocalStorage.

### � Sprint 2.5: Site Público & Pré-Cadastro (Formulário Censo) (26/12 - 31/12)
**Status:** ✅ Concluído (MVP v0.6.13)
**Objetivo:** Capturar demanda e iniciar o funil de cadastro pelo site, com pré-cadastro de responsáveis/alunos e vínculo com escolinhas, preparando o fluxo de aprovação em camadas.
- [x] **Site Público (Marketing):** Site institucional multi‑páginas com CTA e navegação.
- [x] **Captura de Leads:** Formulário de contato com persistência no Supabase (eventos GA/Meta pendentes).
- [x] **Pré-Cadastro (Wizard):** Blocos Guardião/Dependentes/Vínculo, com persistência e retomada.
- [x] **Status de Onboarding:** `pendente_escola` → `aguardando_contrato` → `ativo` (com gestão no CTO).
- [ ] **Confirmação da Escola:** Tela/lista para SchoolAdmin aceitar/rejeitar pré-cadastros.
- [ ] **Assinatura Eletrônica (Forte):** Aceite com evidências (IP, timestamp, device fingerprint, hash de versão) via provedor (DocuSign/Clicksign) e trilha auditável.
- [x] **LGPD (Consentimentos):** Consentimento no envio com evidências mínimas (data/hora, versão e meta básica).

### �🎮 Sprint 3: O Cadastro de Atletas e Responsáveis (29/12 - 04/01)
**Status:** 🚧 Em Andamento (Adiantado)
**Objetivo:** Popular o banco de dados com dados reais e métricas.
- [x] **Conexão de KPIs:** Substituir dados mockados do Dashboard por Queries reais (`useDashboardMetrics`).
- [x] **Painel SchoolAdmin:** Dashboard inicial e gestão de turmas (`ClassesPage`).
- [x] **Cadastro de Aluno:** Formulário completo (Dados Pessoais + Saúde + Responsáveis).
- [x] **Vínculo Familiar:** Lógica para conectar `Guardian` ao `Athlete` (Tabela `guardians`).
- [x] **Gestão de Matrículas:** Adicionar/Remover alunos de turmas.
- [x] **Importação em Massa (CSV):** Tela MVP para importar alunos da planilha legada.
- [x] **Termos de Uso (Legal):** Gate de aceite obrigatório com log (IP/Timestamp/Versão) (em validação).

### 📱 Sprint 4: O "Check-in" e Presença (05/01 - 11/01)
**Objetivo:** A operação diária básica.
- [x] **Lista de Chamada Manual:** Interface para o treinador marcar presença (`ClassAttendancePage`).
- [x] **Gerador de QR Code:** O Técnico ou Admin gera o QR da aula.
- [x] **Leitor de QR (PWA):** O Aluno lê o QR e marca presença.
- [ ] **Regra de Negócio:** Presença só conta se o aluno estiver "Ativo" (Financeiro OK).

### 🏆 Sprint 5: Gamificação Parte 1 - Engine (12/01 - 18/01)
**Objetivo:** O sistema de pontos e níveis.
- [ ] **Estrutura de Badges:** Tabela de `badges` (Verticais) e `tiers` (Horizontais).
- [ ] **Trigger de Pontos:** "Presença = +10XP".
- [ ] **Level Up:** Lógica de subir de nível (Nível 1 -> Nível 2) com animação na tela.
- [ ] **Perfil do Atleta (Card):** Visualização estilo "FUT Card" com foto e nível.
  
**Notas Estratégicas (Conversa de 17/12):**
- **NextPro Academy (Carreira de Scouts):** Definir 5 níveis com pesos na avaliação (e anti-fraude com evidências). Conteúdos/cursos podem entrar por etapas, mas a mecânica de níveis/peso entra como base do produto.
- **Protocolo Pinóquio (Confiabilidade):** Projetar métricas internas visíveis ao staff: `mentiras_confirmadas`, `confiabilidade_avaliador` e **shadow ban silencioso** (peso → 0) para avaliadores recorrentes; sem aviso ao usuário final.
- **Censo Socioeconômico (Wizard):** Estruturar blocos Guardião/Dependentes/Vínculo para futura coleta; perguntas direcionadas poderão ser ajustadas conforme parceiros (ex.: seguradoras).
- **Aprovação em Camadas:** Documentar status do fluxo (Pendente Escola → Aguardando Contrato → Ativo) para integração com Termos/Assinatura em sprint de Legal.

### 🧠 Sprint 5.1: Engines (Técnica + Social + Benefícios) — Especificação e Fundações (19/01 - 25/01)
**Objetivo:** Consolidar o “produto final” das 3 engines e construir as fundações de dados/segurança para executar tudo com auditoria e comparabilidade por temporada.

**Entregáveis (produto e engenharia):**
- [ ] **Manual definitivo das 3 engines:** Técnico, Social e Benefícios (com regras, saídas, anti-fraude, temporadas e integrações).
- [ ] **Camada comum (shared):** Temporada anual + núcleo + sessão de treino + trilha de eventos e evidências.
- [ ] **Rubrica técnica versionada:** Catálogo de perguntas por posição (base + variações), com governança por temporada.
- [ ] **Modelo de avaliação multi-fonte:** Camadas A–D, reputação de avaliadores e “Protocolo Pinóquio” (punição silenciosa).
- [ ] **Contrato de UI/UX do técnico:** Fluxo obrigatório “3 piores → 3 melhores” com seleção de perguntas estilo iFood e notas 0–10.
- [ ] **Contrato de Social (sem live):** Moedas/presentes no feed, fanbase (seguir vs fã), cooldown progressivo e tiers por percentil com ciclo de 15 dias.
- [ ] **Integração Social → Benefícios:** Cashback parcial de moedas para gasto no marketplace (sem afetar nota técnica).
- [ ] **Clube (mercantil):** Assinaturas em 3 níveis + catálogo de 10–15 itens avulsos (sem alterar score técnico).

### 🌟 Sprint 6: Avaliação Técnica Diária (19/01 - 25/01)
**Objetivo:** O input do Treinador.
- [ ] **Tela "Pós-Treino":** Lista de presentes para o técnico avaliar.
- [ ] **Gating obrigatório:** Selecionar 3 piores (avaliar) para liberar 3 melhores (avaliar).
- [ ] **Perguntas por atleta (treino):** 3 perguntas com nota 0–10 via seleção de menus (base + posição).
- [ ] **Posição no treino:** Sugestão automática por frequência e confirmação do técnico quando necessário.
- [ ] **Feedback ao atleta:** Notificação e histórico (sem expor nota crua para o atleta; foco em conceitos/tiers).

### 📊 Sprint 7: Avaliação Mensal & Algoritmo (26/01 - 01/02)
**Objetivo:** A "Prova Real".
- [ ] **Formulário 20–40 critérios por atleta:** Prova mensal por turma (técnico responde por aluno).
- [ ] **Variação por posição:** Total de perguntas pode ser maior; perguntas base comuns a todas as posições.
- [ ] **Normalização e pesos por fonte:** Ponderar notas por camada e reputação; reduzir inflação.
- [ ] **Skill tree / Radar:** Visualização por posição e por temporada (compatível com card EA FC).

### 🚫 Sprint 8: Financeiro e Bloqueio (02/02 - 08/02)
**Objetivo:** A ferramenta de cobrança.
- [ ] **Status Financeiro:** Campo `financial_status` (active, warning, blocked) no perfil do aluno.
- [ ] **Painel de Inadimplência:** SchoolAdmin marca quem não pagou.
- [ ] **Lógica de Bloqueio:** Middleware que impede login de Aluno/Pai/Fan se status == blocked.
- [ ] **Tela de Bloqueio:** "Sua mensalidade está pendente. Procure a secretaria."

### 💬 Sprint 9: Feed Social e Comunidade (09/02 - 15/02)
**Objetivo:** Engajamento da família.
- [ ] **Feed:** Postagens da turma e do atleta (padrão Instagram).
- [ ] **Seguidores vs Fanbase:** Seguir é livre; “ser fã” é vínculo do apoiador com o atleta.
- [ ] **Interações básicas:** Curtir (1 grátis por post), comentar, compartilhar, moderação e denúncias.
- [ ] **Presentes no feed (moedas):** Reações/presentes pagos; compra exige verificação (telefone + CPF no pagamento).
- [ ] **Tiers e ciclo:** Reavaliação a cada 15 dias (subida/queda de tiers por percentil), reset por temporada.

### 🛒 Sprint 10: Marketplace & Vouchers (16/02 - 22/02)
**Objetivo:** Monetização inicial.
- [ ] **Catálogo de Vouchers:** Listagem de parceiros com filtros geográficos (Geo-fencing simples).
- [ ] **Resgate:** Usuário clica em "Resgatar", gera um código único.
- [ ] **Painel Parceiro (MVP):** Visualização básica de quantos vouchers foram resgatados.
- [ ] **Pontos de Benefícios / Cashback:** Saldo de fidelidade para compras e resgates, incluindo cashback parcial vindo do Social.

### 🧪 Sprint 11: Testes e Polish (23/02 - 01/03)
**Objetivo:** Garantia de Qualidade.
- [ ] **Teste de Carga:** Simular 1000 alunos acessando ao mesmo tempo.
- [ ] **UX Review:** Melhorar animações, feedbacks visuais e textos.
- [ ] **Segurança:** Pentest básico (tentar burlar o RLS, tentar ver dados de outra escola).

### 🚀 Sprint 12: Go-Live (02/03 - 08/03)
**Objetivo:** Lançamento.
- [ ] **Reset de Dados:** Limpar dados de teste.
- [ ] **Importação Real:** Subir os dados das 2 escolinhas piloto.
- [ ] **Treinamento:** Workshop com os donos/técnicos das pilotos.
- [ ] **Lançamento:** Liberar acesso para os pais.

---

## 📝 Definição de Pronto (DoD)
Para uma task ser considerada "Pronta":
1.  Código commitado no branch `main`.
2.  Deploy automático realizado no ambiente de Staging.
3.  Funcionalidade testada pelo PO (Você).
4.  Sem erros no console/logs.
