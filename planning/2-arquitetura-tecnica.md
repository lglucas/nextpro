# 🏗️ NextPro - Guia de Arquitetura Técnica

**Versão:** 1.1  
**Data:** 17/01/2026  
**Status:** Aprovado  

---

## 1. Stack Tecnológica

### Frontend (Web/PWA)
- **Framework:** React 19 (via Vite)
- **Linguagem:** TypeScript 5.x (Strict Mode)
- **Estilização:** Tailwind CSS 3.x (Utility-first)
- **Animações:** framer-motion
- **Gerenciamento de Estado:** React State/Context (preferência atual do repositório)
- **Internacionalização:** i18next + react-i18next
- **Roteamento:** react-router-dom (v7)

### Backend (Serverless)
- **Plataforma:** Supabase Cloud (BaaS) - *Migrado de Docker Local (Ver ADR-001)*
- **Banco de Dados:** PostgreSQL 15+ (Gerenciado)
- **Auth:** Supabase Auth (JWT)
- **API/Lógica:** Supabase Edge Functions (Deno/TypeScript)
- **Storage:** Supabase Storage (Buckets com policies; ex.: `student-photos`)
- **Realtime:** Supabase Realtime (Websockets para notificações)

### Infraestrutura & DevOps
- **Repositório:** GitHub (Monorepo simples com `apps/web`)
- **Hospedagem Frontend:** cPanel (deploy de build estático)
- **CI/CD:** Em definição (comandos de base: `npm run lint` e `npm run build`)

---

## 2. Estrutura de Pastas (Feature-Based)

Seguindo a regra de **Vertical Slices** (Features), não organizamos por "tipo de arquivo" (controllers, components), mas por **Funcionalidade**.

```
/
├── apps/
│   ├── web/                 # Aplicação Principal (PWA)
│   │   ├── src/
│   │   │   ├── features/    # O CORAÇÃO DO SISTEMA
│   │   │   │   ├── auth/            # Login, Registro, Recuperar Senha
│   │   │   │   ├── profile/         # Meu Perfil (FUT Card)
│   │   │   │   ├── attendance/      # QR Code, Chamada
│   │   │   │   ├── dashboard/       # Dashboard (visão geral)
│   │   │   │   ├── admin/           # Cantinho do CTO (super_admin)
│   │   │   │   └── school/          # Painel da escolinha (alunos, turmas, matrículas)
│   │   │   ├── contexts/            # Auth / persona (RBAC)
│   │   │   ├── lib/                 # Cliente Supabase
│   │   │   └── layouts/             # Layouts do dashboard e site público
├── packages/
│   ├── ui/                  # Design System compartilhado
│   └── config/              # ESLint, TSConfig
├── supabase/
│   ├── migrations/          # SQL Schema Versionado
│   └── functions/           # Edge Functions (ex: process-monthly-score)
└── README.md
```

## 3. Modelo de Dados (Schema Simplificado)

### Principais Tabelas
- `organizations`: Redes de escolinhas (Matriz).
- `schools`: Unidades físicas (Filiais).
- `users`: Tabela `auth.users` estendida.
- `profiles`: Dados públicos/privados do usuário (nome, foto, role).
- `guardians`: Responsáveis legais (Pais/Mães) - *Adicionado v0.5.0*.
- `students`: Alunos/Atletas (Vinculados a Guardians).
- `classes`: Turmas (Sub-11 Manhã).
- `class_students`: Tabela de junção (N:N) para matrículas - *Adicionado v0.5.0*.
- `class_sessions`: Sessões de treino (Dia 15/12, 09:00).
- `attendances`: Presença por sessão.
- `student_progress`: Estado de XP e nível por atleta.
- `student_xp_events`: Trilhas de XP (idempotência/auditoria).
- `seasons`: Temporadas anuais (base das engines).
- `nuclei`: Núcleos (agrupamento operacional de escolas).
- `school_nuclei`: Vínculo escola → núcleo por temporada.
- `engine_events`: Trilha genérica de eventos por engine (auditável).
- `technical_questions`: Catálogo versionado de rubricas (perguntas 0–10).

## 4. Segurança & Privacidade (RLS)

O **Row Level Security (RLS)** do PostgreSQL é nossa barreira de defesa. Nenhuma query roda sem passar por ele.

**Regras de Ouro:**
1.  **Isolation:** Um usuário só vê dados da escola dele, salvo `super_admin`.
2.  **Menores:** Exposição de dados do atleta é sempre por vínculo e papel (LGPD).
3.  **Integridade:** Regras críticas não ficam apenas na UI (ex.: bloqueio de presença para aluno inativo foi aplicado no banco).

## 5. Internacionalização (i18n)

Todas as strings visíveis devem usar chaves de tradução.
- **Errado:** `<h1>Bem-vindo</h1>`
- **Certo:** `<h1>{t('home.welcome')}</h1>`

Estrutura do JSON de tradução:
```json
{
  "auth": {
    "login_button": "Entrar",
    "password_placeholder": "Sua senha segura"
  },
  "gamification": {
    "level_up": "Subiu de Nível!",
    "points_earned": "Você ganhou {{count}} pontos"
  }
}
```

## 6. Padrões de Código (Code Quality)
- **Commits:** Conventional Commits (`feat: add login screen`, `fix: qr code bug`).
- **Linting:** ESLint (`npm run lint`).
- **Build:** Typecheck + build (`npm run build`).
