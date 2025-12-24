# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.3] - 2025-12-24
### Fixed
- **Dev Environment:** Corrigido erro do Vite/React-Babel de módulo ausente (`@babel/helper-validator-identifier`) com reinstalação confiável via lockfile.
- **Auth:** Separado `AuthProvider` do `AuthContext` para estabilizar Fast Refresh e reduzir falsos positivos do lint.
- **TypeScript/Lint:** Removidos `any` e imports não usados em páginas de Auth, Dashboard, CTO Corner e área escolar.
- **PDF:** Ajustada tipagem de cores e removido `@ts-ignore` para destravar build.

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
