# 🏆 NextPro - Plataforma de Gestão Esportiva

> **Sprint 4 em andamento 🚧** (última release: v0.6.16)

O **NextPro** é uma solução completa para digitalização de escolinhas de futebol, gestão de carreiras de atletas e engajamento familiar. Focada em PWA (Web First) para alta acessibilidade.

## 🚀 Status do Projeto

Atualmente estamos na **Fase 1 (Setup & Alicerce)**. O sistema já possui autenticação robusta, painel administrativo completo e gestão de entidades básicas.

### ✨ Funcionalidades Atuais
- **Autenticação & Segurança:**
  - Login/Registro com Supabase Auth.
  - Controle de Acesso Baseado em Função (RBAC): **SuperAdmin**, **Partner**, **User**.
  - *Self-Healing*: Correção automática de perfis corrompidos.
  - *Audit Logs*: Rastreabilidade total de ações críticas.

- **Dashboard Administrativo:**
  - Layout responsivo com Sidebar dinâmica.
  - **Gestão de Escolas (CRUD):** Cadastro completo de unidades.
  - **Gestão de Alunos e Turmas:** Matrículas, frequência e cadastro de responsáveis.
  - **Chamada Online:** Registro de presença em tempo real.
  - **Relatórios PDF:** Geração automática de listas e resumos executivos.
  - **Cantinho do CTO:** Área exclusiva para configurações globais do sistema.

- **Site Público + Pré‑Cadastro:**
  - Site institucional multi‑páginas (rota `/`).
  - Wizard do censo em `/pre-cadastro` com persistência e envio.
  - CTO: listagem de pré‑cadastros + status de onboarding.
  - Contato em `/contato` com gravação no Supabase (`contact_messages`) e anti-spam opcional (Turnstile).

- **App do Usuário (Atleta):**
  - Landing Page personalizada.
  - Visualização de perfil básico.
  - (Em validação) Gate de Termos de Uso com log de aceite (Sprint 3).

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Estilização** | Tailwind CSS v3, Lucide Icons |
| **Backend (BaaS)** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **Relatórios** | jsPDF, AutoTable |
| **Infraestrutura** | Vercel (Frontend), Supabase Cloud (DB) |

## 📦 Estrutura do Repositório (Monorepo)

```bash
nextpro/
├── apps/
│   └── web/            # Aplicação Principal (PWA)
├── planning/           # Documentação de Produto & Roadmap
│   ├── 1-roadmap-sprints.md
│   ├── sprint-02-report.md
│   ├── sprint-02.5-report.md
│   └── sprint-03-report.md
├── supabase/           # Migrations e Configs de Banco
└── packages/           # Libs compartilhadas (UI Kit - WIP)
```

## 📚 Documentação e Planejamento

Para detalhes sobre o roteiro de desenvolvimento e decisões técnicas, consulte a pasta `/planning`:

- [📌 Roadmap de Sprints](./planning/1-roadmap-sprints.md) - Visão geral de todas as fases.
- [🏗️ Arquitetura Técnica](./planning/2-arquitetura-tecnica.md) - Decisões de stack e infra.
- [📝 Relatório Sprint 1](./planning/sprint-01-report.md) - Setup inicial.
- [📝 Relatório Sprint 2](./planning/sprint-02-report.md) - Dashboard & Entidades.
- [📝 Relatório Sprint 2.5](./planning/sprint-02.5-report.md) - Site Público & Pré‑Cadastro.
- [📝 Relatório Sprint 3](./planning/sprint-03-report.md) - Execução parcial e próximos passos.

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js (v18+)
- Conta no [Supabase](https://supabase.com)

### Passo a Passo

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/lglucas/nextpro.git
    cd nextpro
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```
    Se você tiver erro no Vite/Babel (ex: módulo `@babel/*` ausente), prefira instalar pelo lockfile do app web:
    ```bash
    cd apps/web
    npm ci
    ```

3.  **Configure o Ambiente**
    Crie um arquivo `apps/web/.env` baseado no exemplo:
    ```bash
    cp apps/web/.env.example apps/web/.env
    ```
    Preencha com suas chaves do Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
    Opcional (anti-spam/captcha):
    - `VITE_TURNSTILE_SITE_KEY` (Cloudflare Turnstile) para habilitar verificação no Contato e Pré‑Cadastro.

4.  **Banco de Dados**
    Rode os scripts SQL localizados em `supabase/migrations/` no SQL Editor do seu projeto Supabase para criar as tabelas necessárias (`profiles`, `schools`, `audit_logs`).
    Se você estiver usando o Contato:
    - Rode `06_create_contact_messages.sql`.

5.  **Execute**
    ```bash
    npm run dev
    ```
    Acesse:
    - Site público: `http://localhost:5173/`
    - App (área logada): `http://localhost:5173/app`
    - Dashboard admin: `http://localhost:5173/dashboard`

## 📄 Licença

Proprietário. Todos os direitos reservados.
