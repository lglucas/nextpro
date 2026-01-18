# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Fixed

## [0.7.13] - 2026-01-18
### Added
- **Financeiro (DB):** `financial_status` no aluno (active/warning/blocked).
- **Dashboard (Alunos):** Controle de status financeiro na listagem de alunos.
- **App (Atleta):** Tela de bloqueio financeiro e gate de acesso.

## [0.7.12] - 2026-01-18
### Added
- **CTO (Engines):** Tela para gerenciar reputação do avaliador (peso + shadow ban).
### Changed
- **Dashboard (Alunos):** Skill tree exibe labels de posição.

## [0.7.11] - 2026-01-18
### Added
- **Engine Técnica (DB):** Pilar (`tecnica/tatica/mental/fisico`) nas rubricas diárias.
- **Engine Técnica (DB):** Reputação do avaliador com shadow ban (MVP).
- **Dashboard (Alunos):** Skill tree (temporada) por pilares, com filtro de posição.
### Changed
- **CTO (Engines):** Gestão de rubricas diárias inclui pilar.
- **Engine Técnica (DB):** Normalização mensal por turma inclui fonte diária e reputação (MVP).
- **Pós-treino:** Eventos diários gravam `pillar` no `meta`.

## [0.7.10] - 2026-01-18
### Added
- **Engine Técnica (DB):** Pilar (`tecnica/tatica/mental/fisico`) nas rubricas mensais.
- **Engine Técnica (DB):** Função RPC de normalização mensal por turma (MVP).
- **Engine Técnica (DB):** Seed de pesos iniciais por fonte/papel (`technical_weights_v1`) usado na normalização.
### Changed
- **CTO (Engines):** Gestão de rubricas mensais inclui pilar.
- **Avaliação Mensal:** Eventos gravam `pillar` no `meta`.
- **Dashboard (Alunos):** Radar mensal passa a usar pilar configurado (com fallback).
- **Dashboard (Alunos):** Exibe score normalizado (turma) no card do atleta.

## [0.7.9] - 2026-01-18
### Added
- **Dashboard (Alunos):** Radar por pilares (técnica/tática/mental/físico) na avaliação mensal do card.


## [0.7.8] - 2026-01-17
### Added

## [0.7.7] - 2026-01-17
### Added
- **Dashboard (Alunos):** Histórico de avaliações mensais por temporada no card do atleta (mês selecionável).
- **Dashboard (Alunos):** Destaques e pontos de atenção (Top/Bottom rubricas) na avaliação mensal.
### Changed
- **Dashboard (Alunos):** Ficha do atleta refatorada em componentes menores.

## [0.7.6] - 2026-01-17
### Added
- **Docs:** Guia de changelog e versionamento.
### Changed
- **Changelog:** Refatorado para releases 0.7.x (sem acumular entregas em `Unreleased`).
- **Planning:** Roadmap atualizado com itens concluídos nas sprints 6–7 (MVP).

## [0.7.5] - 2026-01-17
### Added
- **Dashboard (Personas):** Landing por role (`/dashboard` → `operacao`/`partner`/`overview`).
- **Dashboard (Operação):** Home operacional para Coach/Gestor com atalhos e Top 3 (XP).
- **Dashboard (Partner):** Home dedicada com KPIs macro (escolas/alunos/turmas).
- **Docs:** Documentação das personas e rotas do dashboard.
### Changed
- **Dashboard:** Menu e troca de persona redirecionam para a home correta.
- **Dashboard:** Remove links/atalhos sem página funcional (relatórios).

## [0.7.4] - 2026-01-17
### Added
- **Dashboard (Alunos):** Ficha do atleta (FUT Card) em `/dashboard/students/:id/card`.
- **Dashboard (Visão Geral):** Widget Top 3 alunos (XP) com link para ficha.
- **Dashboard (Alunos):** Resumo da última avaliação técnica mensal no card do atleta.
### Changed
- **Dashboard (Alunos):** Ação “Ver ficha” na lista de alunos.

## [0.7.3] - 2026-01-17
### Added
- **Engine Técnica:** Seeds V1 de rubricas diárias e mensais para a temporada ativa.
- **Engine Técnica:** Seeds V2 com expansão de rubricas (mais opções) para a temporada ativa.
- **Docs:** Catálogo de rubricas V1/V2 no planning.

## [0.7.2] - 2026-01-17
### Added
- **Engine Técnica:** Estrutura de rubricas mensais (`technical_monthly_questions`) e tela de avaliação mensal por turma.
- **CTO (Engines):** Gestão de rubricas mensais na aba Engines.
- **Dashboard (Turmas):** Atalho para “Avaliação mensal” por turma.

## [0.7.1] - 2026-01-17
### Added
- **App (Atleta):** Página de histórico técnico baseada em `engine_events` (resumo por treino).
- **Dashboard (Professor):** Resumo técnico por sessão (3 piores/3 melhores) via `engine_events`.
- **Engine Técnica:** Tela “Pós‑treino” (3 piores → 3 melhores) salvando eventos técnicos.
- **Engine Técnica (DB/RLS):** Professor pode ler eventos técnicos da escola (`engine_events`).
### Changed
- **App (Atleta):** Home usa dados reais para próximo treino e frequência.
- **App:** Coach agora vê link de acesso ao dashboard na barra superior.
- **App (Atleta):** Home exibe indicador de feedback técnico novo.

## [0.7.0] - 2026-01-17
### Added
- **Engines (Base):** Temporadas, núcleos e vínculo escola→núcleo por temporada (DB + RLS).
- **Engines (Base):** Trilha de eventos (`engine_events`) para auditoria por engine (DB + RLS).
- **Engine Técnica:** Catálogo versionado de perguntas (`technical_questions`) por temporada/posição.
- **CTO:** Aba Engines para gerir temporadas, núcleos e rubricas.
- **Planning:** Sprint 5.1 detalhado + ADR-002 (fundações das 3 engines).
- **Engine Técnica (DB/RLS):** Professor/gestor pode inserir/editar/remover eventos técnicos próprios (`engine_events`).
### Fixed
- **Dashboard:** Evita crash ao renderizar `audit_logs.details` (objeto JSON) e remove query em tabela inexistente (`evaluations`).

## [0.6.23] - 2026-01-17
### Added
- **Alunos:** Edição, exclusão e ativar/inativar na lista (CRUD completo).
- **Turmas:** Edição, exclusão e ativar/inativar na lista (CRUD completo).
- **Alunos:** Upload de foto no cadastro/edição com preview.
- **Alunos:** Remover foto (apaga no Storage e limpa `photo_url`).
- **Supabase (Storage):** Bucket `student-photos` com policies de upload por escola.
### Fixed
- **Chamada/QR:** Impede marcar presença como “presente” para aluno inativo (UI + trigger no banco).

## [0.6.21] - 2026-01-15
### Added
- **Pré‑Cadastro (SchoolAdmin):** Página `/dashboard/pre-cadastros` para validar (confirmar/rejeitar) envios da escolinha.
- **Pré‑Cadastro (Convite):** Link com `schoolId` para atrelar o censo à escola e liberar triagem por gestor.
- **Supabase (Pré‑Cadastro):** Campos `school_id`, `school_reviewed_*` em `pre_registrations` para revisão da escola.
### Changed
- **Pré‑Cadastro:** Login/cadastro preservam parâmetros do convite ao voltar para `/pre-cadastro`.

## [0.6.20] - 2026-01-15
### Added
- **RLS (Profiles):** Super Admin pode listar e atualizar perfis (role e escola) no painel.
- **RLS (Coach):** Professor (coach) pode criar/editar/remover suas próprias turmas (`teacher_id = auth.uid()`).
### Fixed
- **Turmas:** Impede criar turma sem escola vinculada (evita erro `invalid input syntax for type uuid: ""`).
- **RLS (Profiles):** Corrige recursão infinita nas policies que travava login/validação de termos.
- **RLS (Class Students):** Corrige recursão infinita que quebrava contagem/listagem de turmas.
- **QA (Manual):** Fluxo Turmas → Matrículas → Chamada/QR validado ponta a ponta.

## [0.6.18] - 2026-01-15
### Added
- **RLS (Coach):** Policies para professor (coach) operar em turmas, matrículas e chamadas na própria escola.
### Fixed
- **Dashboard:** Rotas de atalho para evitar redirecionamento ao site público quando acessar caminhos ainda não implementados (`/dashboard/attendance`, `/dashboard/reports`).

## [0.6.17] - 2026-01-10
### Added
- **Gamificação (DB):** Estrutura inicial de XP/níveis (`student_progress`, `student_xp_events`).
- **Gamificação (DB):** Estrutura base de badges e tiers (`badges`, `tiers`, `student_badges`).
- **Gamificação (DB):** Trigger de XP por presença (presença = +XP base via `system_settings.xp_base`).
- **App (Atleta):** Exibir XP e nível após check-in via QR (com aviso de level up).
- **App (Atleta):** Card do atleta no Meu Perfil com nível e barra de XP.

## [0.6.16] - 2026-01-10
### Fixed
- **Attendance/RLS:** Bloquear check-in via QR para atleta inativo (`students.active = false`).

## [0.6.15] - 2026-01-10
### Added
- **Attendance:** Check-in de presença por QR Code (rota `/app/check-in`).
- **Attendance:** Botão "QR Check-in" na chamada para gerar QR/link da sessão.
- **Attendance:** Expiração configurável do QR (1h/2h/3h) e exibição do horário limite.
- **Attendance:** Contagem de check-ins em tempo real no modal do QR.
- **Database/RLS:** Policies para atleta ler seus vínculos e registrar presença do dia via QR.
- **Database:** Campo `qr_checkin_expires_at` em `class_sessions` para validar expiração no banco.

## [0.6.14] - 2026-01-09
### Added
- **CTO:** Modo de visualização (trocar persona) disponível apenas para Super Admin.
- **Site:** Contato grava mensagens no Supabase (`contact_messages`).
- **Segurança:** Turnstile opcional no Contato e no envio do Pré‑Cadastro.
- **SchoolAdmin:** Importação CSV de alunos (MVP) no painel.
- **SchoolAdmin:** Exportação PDF da lista de presença por aula.
- **Legal:** Gate de Termos com log de aceite (em branch `sprint-03-terms-aceite`).
### Changed
- **Docs:** Alinhar README/Planning com stack e fluxo real do monorepo.
- **Dashboard:** Remover KPIs fictícios e sinalizar itens "Em breve".
### Fixed
- **Repo:** Ignorar CSVs internos de teste em `planning/`.

## [0.6.13] - 2025-12-26
### Added
- **Pré‑Cadastro:** `onboarding_status` no Supabase (pendente_escola → aguardando_contrato → ativo).
- **Pré‑Cadastro:** Evidências mínimas de consentimento (`consented_at`, `consent_version`, `submitted_meta`).
- **CTO:** Edição do status de onboarding diretamente na lista de pré‑cadastros.
### Fixed
- **Anti‑Spam:** Honeypot no envio do pré‑cadastro para reduzir automações básicas.

## [0.6.12] - 2025-12-24
### Added
- **CTO:** Nova aba para listar pré‑cadastros do censo no painel administrativo.
- **Auth UI:** Menu de usuário no site público (Meu Perfil + Sair) e página placeholder de perfil.
### Changed
- **Auth Flow:** Login/cadastro respeitam `returnTo` e retornam para `/pre-cadastro` quando aplicável.
### Fixed
- **RLS:** Super Admin passa a ter acesso de leitura/gestão em `pre_registrations` e leitura em `school_suggestions`.

## [0.6.11] - 2025-12-24
### Added
- **Pré‑Cadastro:** Tabela `pre_registrations` e `school_suggestions` com RLS para censo por responsável.
- **Pré‑Cadastro:** Wizard do censo em `/pre-cadastro` com etapas, validação e persistência (rascunho e envio).

## [0.6.10] - 2025-12-24
### Added
- **Site Público:** Componentes de UI reutilizáveis (Hero/Section/Card/Callout) e seções da Home para padronização visual.
### Changed
- **Site Público:** Revisão e expansão de textos em todas as páginas e melhoria do layout para um tom mais premium.
### Fixed
- **Lint/Build:** Corrigidos warnings do `react-hooks/exhaustive-deps` nas páginas escolares e ajustado import de ícone inválido no site.

## [0.6.9] - 2025-12-24
### Changed
- **Site Público:** Refinados textos e navegação do site institucional (Home e Como Funciona) e ajustado visual para um tom mais premium.

## [0.6.8] - 2025-12-24
### Added
- **Site Público:** Estrutura inicial do site institucional multi‑páginas (layout público, navegação, footer e páginas base).
### Changed
- **Routing:** Site público passa a viver em `/` e a plataforma do usuário em `/app` (dashboard permanece em `/dashboard`).
- **Auth:** Login e cadastro redirecionam para `/app` após autenticação.

## [0.6.7] - 2025-12-24
### Added
- **Planning:** Wireframe textual por página do site público (inclui rota escondida `/pre-cadastro`) para guiar a implementação.

## [0.6.6] - 2025-12-24
### Changed
- **Planning:** Reescrita da seção de conceitos para linguagem institucional (copy base) e renumeração das seções do documento do Sprint 2.5.

## [0.6.5] - 2025-12-24
### Changed
- **Planning:** Refinado o documento do Sprint 2.5 com conceitos de núcleos, avaliação multi‑fonte (pesos e reputação), inputs diários/mensais das escolinhas e melhorias no wizard (filhos e perguntas socioeconômicas).

## [0.6.4] - 2025-12-24
### Added
- **Planning:** Documento detalhado do Site Público (institucional, multi‑páginas) e do Pré‑Cadastro (censo familiar) com fluxo de validação por escolinha.

## [0.6.3] - 2025-12-24
### Fixed
- **Dev Environment:** Corrigido erro do Vite/React-Babel de módulo ausente (`@babel/helper-validator-identifier`) com reinstalação confiável via lockfile.
- **Auth:** Separado `AuthProvider` do `AuthContext` para estabilizar Fast Refresh e reduzir falsos positivos do lint.
- **TypeScript/Lint:** Removidos `any` e imports não usados em páginas de Auth, Dashboard, CTO Corner e área escolar.
- **PDF:** Ajustada tipagem de cores e removido `@ts-ignore` para destravar build.
### Changed
- **Rollback:** Revertido o repositório para o commit `16c6b2c539ba6b6d94f742e19de9d8e07978216` para remover o site institucional/formulário fora do padrão esperado (reset hard + force push), e então estabilizado o build/lint após o rollback.

## [0.6.2] - 2025-12-17
### Added
- **Planning:** Criado `Sprint 2.5` (Site Público + Pré-Cadastro via formulário) e refinado `Sprint 5` com notas estratégicas de Gamificação, NextPro Academy (carreira de scouts), Protocolo Pinóquio e Censo (wizard).
- **Business Rules:** Documentadas novas seções em `planning/3-regras-negocio-funcionais.md` cobrindo:
  - Carreira de Scouts (níveis e pesos),
  - Protocolo Pinóquio (métricas internas e shadow ban),
  - Censo Familiar (blocos e privacidade),
  - Aprovação em camadas (status e assinatura),
  - Parceiros e perguntas direcionadas.

### Changed
- **Legal:** Reafirmada necessidade de assinatura eletrônica forte (IP, timestamp, device fingerprint, hash de versão) preferencialmente via provedor (DocuSign/Clicksign) com logs e webhooks.
- **Monetização:** Registrado que múltiplos perfis terão fluxos pagos (pais, scouts, reps de clubes) incluindo marketplace e micro-serviços (fora do MVP imediato).

## [0.6.1] - 2025-12-16
### Fixed
- **Bugfix:** Tratamento de erro na `ClassesPage` para evitar tela branca quando a API retorna erro ou nulo.
- **Database:** Consolidação dos scripts SQL de migração para facilitar execução manual no Supabase Cloud.

## [0.6.0] - 2025-12-16
### Added
- **Attendance:** Banco de dados (tabelas `class_sessions`, `attendances`) e UI para Chamada.
- **UI:** Página de Chamada (`ClassAttendancePage`) com criação de sessões e lista de presença.
- **UX:** Botão "Chamada" na lista de Turmas para acesso rápido.
- **Routing:** Rota `/classes/:id/attendance` configurada.

## [0.5.0] - 2025-12-16
### Added
- **Database:** Novas tabelas `guardians` (Responsáveis) e `class_students` (Matrículas) com RLS.
- **Feature:** Gestão de Responsáveis integrada ao fluxo de cadastro de alunos.
- **Feature:** Gestão de Matrículas (Adicionar/Remover alunos) diretamente na tela de Turmas.
- **Dashboard:** Conexão com dados reais de Alunos, Turmas, Avaliações e Logs de Auditoria.
- **UX:** Modal de seleção de alunos com busca em tempo real.
- **UI:** Exibição das turmas matriculadas na lista de estudantes.

### Changed
- **Refactor:** Cadastro de aluno agora exige seleção prévia de um Responsável existente (Hierarquia Estrita).
- **Refactor:** Página de Turmas agora exibe contagem real de alunos e permite gestão.
- **Refactor:** Dashboard atualizado para consumir dados reais do Supabase ao invés de mocks.

## [0.4.0] - 2025-12-16
### Added
- **CTO Corner:** Implementado painel de super-administração com:
  - **Configurações Globais:** Tabela `system_settings` para gestão dinâmica de variáveis.
  - **Audit Logs:** Tabela `audit_logs` e visualização detalhada de ações críticas.
  - **Gestão de Usuários:** Interface para promoção/rebaixamento de permissões (User/Partner/SuperAdmin).
- **PDF Export:** Implementado gerador de relatórios PDF com cabeçalho, rodapé e logo estilizados (`utils/pdf.ts`).
- **Dashboard:** Funcionalidade de exportação de relatório PDF integrada à tela de Escolas.

### Changed
- **UX/Nav:** Logo e nome "NextPro" agora linkam para a Home em todos os layouts.
- **Performance:** Persistência de `role` no `localStorage` para evitar "flicker" de menu durante navegação.
- **Dependencies:** Adicionada lib `date-fns` para formatação de datas.

## [0.3.0] - 2025-12-16
### Added
- **Layout:** Implementado `AppLayout` (Consumer) e `DashboardLayout` (Admin) com navegação distinta.
- **Home:** Criada Landing Page (`HomePage`) para usuários logados.
- **Nav:** Barra de navegação com link condicional para "Área Administrativa" (apenas SuperAdmin/Partner).
- **Resilience:** Adicionado *Self-Healing* no `AuthContext` para criar perfis ausentes automaticamente.
- **Logs:** Criada tabela `audit_logs` e widget de logs no Dashboard.

## [0.2.5] - 2025-12-16
### Added
- **Auth:** Implementada página de Cadastro (`Register.tsx`) funcional.
- **Backend:** Criado script SQL (`migrations/init_auth_roles.sql`) para gerenciar Roles e Perfis.
- **Context:** Atualizado `AuthContext` para suportar RBAC (Role-Based Access Control) via tabela `profiles`.

## [0.2.4] - 2025-12-16
### Changed
- **Infra:** Migração do Supabase Local (Docker) para Supabase Cloud para reduzir complexidade e uso de disco.
- **Config:** Removidos scripts e configurações locais do Docker (`supabase/` folder).
- **Setup:** Atualizado fluxo de setup para usar `.env` com credenciais da nuvem.

## [0.2.3] - 2025-12-16
### Fixed
- **Auth:** Corrigido bug de "Tela Branca" ao adicionar UI de Loading (`Spinner`) no `AuthContext`.
- **Debug:** Adicionados logs no ciclo de vida de autenticação para facilitar diagnóstico.
- **Config:** Criado arquivo `.env` padrão para evitar falhas de inicialização do Supabase Client.

## [0.2.2] - 2025-12-16
### Added
- **Auth:** Implementado `AuthContext` para gerenciar estado de sessão global.
- **Login:** Conectada página de Login ao Supabase Auth (`signInWithPassword`).
- **Segurança:** Adicionada validação de erros e loading state no formulário de login.

## [0.2.1] - 2025-12-16
### Added
- **Auth:** Criada tela de Login (`src/features/auth/pages/Login.tsx`) com layout responsivo.
- **Routing:** Configurado `react-router-dom` e rota padrão redirecionando para `/login`.
- **DX:** Adicionado script `npm run dev` na raiz para facilitar execução.
- **Config:** Configurado path alias `@` para imports limpos (ex: `@/components`).

## [0.2.0] - 2025-12-16
### Added
- **Monorepo:** Configurado workspace `pnpm` com estrutura `apps/web` e `packages/ui`.
- **Frontend:** Inicializado projeto React (Vite) + Tailwind CSS v3 + TypeScript.
- **Backend:** Inicializado projeto Supabase local (configuração CLI).
- **Utils:** Criado cliente Supabase Singleton em `apps/web/src/lib/supabase.ts`.

## [0.1.0] - 2025-12-15
### Added
- **Planejamento:** Criada pasta `planning/` com a "Bíblia do Projeto":
    - `1-roadmap-sprints.md`: Cronograma detalhado de 12 Sprints (Março/2026).
    - `2-arquitetura-tecnica.md`: Definição de Stack (React, Supabase, Monorepo) e Padrões.
    - `3-regras-negocio-funcionais.md`: Regras de Gamificação, Scouting e Financeiro.
- **Documentação:** Criado `README.md` com instruções iniciais e links para a documentação.
- **Conceito:** Definido nome "NextPro" e identidade técnica (PWA Web First).
- **Estrutura:** Definida arquitetura Feature-Based (Vertical Slices) e Monorepo.

### Changed
- **Arquitetura:** Alterada abordagem de "Flutter Mobile" para "React Web/PWA" visando agilidade e MVP.
- **Escopo:** Refinado escopo de MVP para focar em "Digitalização de Escolinhas + Gamificação", deixando Marketplace físico e Wallet complexa para V1.1.
