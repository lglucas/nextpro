# 🏆 NextPro - Plataforma de Gestão Esportiva

> **Sprint 2 Concluída ✅** (v0.6.1)

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

- **App do Usuário (Atleta):**
  - Landing Page personalizada.
  - Visualização de perfil básico.

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18, TypeScript, Vite |
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
│   └── sprint-02-report.md
├── supabase/           # Migrations e Configs de Banco
└── packages/           # Libs compartilhadas (UI Kit - WIP)
```

## 📚 Documentação e Planejamento

Para detalhes sobre o roteiro de desenvolvimento e decisões técnicas, consulte a pasta `/planning`:

- [📌 Roadmap de Sprints](./planning/1-roadmap-sprints.md) - Visão geral de todas as fases.
- [🏗️ Arquitetura Técnica](./planning/2-arquitetura-tecnica.md) - Decisões de stack e infra.
- [📝 Relatório Sprint 1](./planning/sprint-01-report.md) - Setup inicial.
- [📝 Relatório Sprint 2](./planning/sprint-02-report.md) - Dashboard & Entidades.

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

4.  **Banco de Dados**
    Rode os scripts SQL localizados em `supabase/migrations/` no SQL Editor do seu projeto Supabase para criar as tabelas necessárias (`profiles`, `schools`, `audit_logs`).

5.  **Execute**
    ```bash
    npm run dev
    ```
    Acesse: `http://localhost:5173`

## 📄 Licença

Proprietário. Todos os direitos reservados.
