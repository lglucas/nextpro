# 🏗️ NextPro - Guia de Arquitetura Técnica

**Versão:** 1.0  
**Data:** 15/12/2025  
**Status:** Aprovado  

---

## 1. Stack Tecnológica

### Frontend (Web/PWA)
- **Framework:** React 18+ (via Vite)
- **Linguagem:** TypeScript 5.x (Strict Mode)
- **Estilização:** Tailwind CSS 3.x (Utility-first)
- **Animações:** Framer Motion (Gestos e Transições fluidas)
- **Gerenciamento de Estado:** Zustand (Leve e performático) ou React Context (para coisas simples)
- **Data Fetching:** TanStack Query (React Query) - Cache e SWR
- **Internacionalização:** i18next (PT, EN, ES desde o dia 0)
- **Roteamento:** React Router 6 (Data Router)

### Backend (Serverless)
- **Plataforma:** Supabase Cloud (BaaS) - *Migrado de Docker Local (Ver ADR-001)*
- **Banco de Dados:** PostgreSQL 15+ (Gerenciado)
- **Auth:** Supabase Auth (JWT)
- **API/Lógica:** Supabase Edge Functions (Deno/TypeScript)
- **Storage:** Supabase Storage (Buckets privados com RLS)
- **Realtime:** Supabase Realtime (Websockets para notificações)

### Infraestrutura & DevOps
- **Repositório:** GitHub (Monorepo com Turborepo ou PNPM Workspaces)
- **Hospedagem Frontend:** cPanel (Deploy via FTP/Git Action de arquivos estáticos buildados)
- **CI/CD:** GitHub Actions (Lint, Test, Build, Deploy)

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
│   │   │   │   ├── gamification/    # Badges, Níveis, Pontos
│   │   │   │   ├── attendance/      # QR Code, Chamada
│   │   │   │   ├── scouting/        # Avaliação Técnica, Radar Chart
│   │   │   │   ├── feed/            # Social Feed, Comentários
│   │   │   │   ├── financial/       # Bloqueios, Vouchers
│   │   │   │   └── profiles/        # Perfil Atleta, Configs
│   │   │   ├── components/  # Componentes UI Genéricos (Button, Input)
│   │   │   ├── hooks/       # Hooks Globais (useTheme, useAuth)
│   │   │   ├── lib/         # Configurações (axios, supabase client)
│   │   │   └── locales/     # Arquivos de Tradução (pt-BR, en-US)
│   └── admin/               # (Opcional) Painel SuperAdmin separado ou rota interna
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
- `attendances`: Presença (Link user_id + session_id).
- `badges`: Definição das medalhas.
- `user_badges`: Medalhas ganhas pelo usuário.
- `evaluations`: Notas técnicas (JSONB para flexibilidade dos 40 critérios).

## 4. Segurança & Privacidade (RLS)

O **Row Level Security (RLS)** do PostgreSQL é nossa barreira de defesa. Nenhuma query roda sem passar por ele.

**Regras de Ouro:**
1.  **Isolation:** Um `SchoolAdmin` NUNCA pode ler dados onde `school_id` for diferente do dele.
2.  **Privacy:** Dados sensíveis (peso, altura) só são visíveis se `user_id == auth.uid()` OU `user_id IN (meus_filhos)` OU `role IN ('coach', 'scout')`.
3.  **Block:** Se `profile.financial_status == 'blocked'`, todas as policies de leitura retornam erro ou vazio (exceto a tela de pagamento).

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
- **Linting:** ESLint + Prettier rodando no pre-commit hook (Husky).
- **Testes:** Vitest para lógica de negócios complexa (ex: cálculo de score).
