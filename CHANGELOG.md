# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
