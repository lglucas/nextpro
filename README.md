# NextPro (SuperApp Futebol) — Plataforma de Escolinhas + Engines NextPro

**Última versão documentada no repo:** v0.7.0 (Jan/2026)

O NextPro é um super app para escolinhas de futebol com 3 engines planejadas (Técnica, Social e Benefícios). O projeto é Web-first (PWA), com Supabase como backend (Postgres + Auth + Storage + RLS).

## Status do produto (o que já existe)
**Operação diária (escolinha)**
- Turmas: CRUD completo + matrícula (adicionar/remover alunos).
- Alunos: CRUD completo + ativar/inativar + upload/remover foto (Storage).
- Presença: chamada manual + QR check-in (atleta) com validações de regra (aluno inativo não marca presente).

**Gamificação (base já entregue)**
- XP e nível por atleta (DB) com idempotência por evento.
- Trigger: presença confirmada gera XP automaticamente.
- “FUT Card” no perfil do atleta (foto + nível + XP).

**Engines (fundações prontas, Sprint 5.1)**
- Temporadas (ano), Núcleos e vínculo escola → núcleo por temporada.
- Trilhas de eventos por engine (`engine_events`) para auditoria/idempotência.
- Catálogo técnico versionado de perguntas (`technical_questions`) por temporada/posição.
- Cantinho do CTO: telas para administrar temporadas, núcleos e rubricas.

## O que ainda falta (próximos sprints)
**Engine Técnica**
- Fluxo “Pós‑Treino” do técnico: gating 3 piores → 3 melhores, com perguntas 0–10.
- Prova mensal (20–40 perguntas por atleta, por turma) por temporada.
- Agregações: skills (por posição) + ranking por turma/escola/núcleo + histórico anual.
- Reputação do avaliador + Pinóquio (punição silenciosa) + pesos multi-fonte (A–D).

**Engine Social**
- Feed estilo Instagram (sem live), moedas/presentes, fanbase (seguir vs fã), cooldown.
- Tiers por percentil com ciclo de 15 dias, reset por temporada.

**Engine de Benefícios**
- Pontos/cashback e integração com marketplace.

## Engines (visão clara)
O produto tem 3 engines separadas, com integrações explícitas:
- **Técnica (futebol):** mede evolução técnica (0–10), por posição, por treino e por temporada.
- **Social (influência econômica):** mede influência monetizável (moedas/presentes/fanbase) e ranking por tiers.
- **Benefícios (fidelidade):** pontos/cashback para marketplace e parceiros.

Tudo isso se apoia numa camada comum: temporada, núcleo, sessão/treino, eventos auditáveis e segurança (RLS).

## Rubricas técnicas: o que é o “key”
Nas rubricas (tabela `technical_questions`), o campo `key` é o **identificador técnico estável** da pergunta:
- O `prompt` é o texto humano (pode mudar).
- O `key` é o id interno (não deve mudar), usado para histórico, agregações e comparações.

Formato recomendado: `snake_case` sem acentos, ex.: `finalizacao_pe_fraco`, `passe_vertical`, `1v1_defensivo`.

## Stack
- Frontend: React 19 + TypeScript + Vite + React Router
- UI: Tailwind CSS + Lucide + framer-motion
- i18n: i18next + react-i18next
- Backend: Supabase (Postgres, Auth, Storage, RLS, Realtime)
- Relatórios: jsPDF + AutoTable

## Estrutura do repositório
```bash
/
├── apps/
│   └── web/                 # App web (PWA)
├── planning/                # Planejamento e docs do produto/engenharia
├── project/                 # Documentos de especificação das 3 engines (referência)
└── supabase/
    └── migrations/          # Migrations SQL do banco
```

## Documentação
- Índice do planejamento: [planning/README.md](./planning/README.md)
- Roadmap: [planning/1-roadmap-sprints.md](./planning/1-roadmap-sprints.md)
- Arquitetura técnica: [planning/2-arquitetura-tecnica.md](./planning/2-arquitetura-tecnica.md)
- Regras (atuais + planejadas): [planning/3-regras-negocio-funcionais.md](./planning/3-regras-negocio-funcionais.md)

Documentos de referência das engines (produto):
- Manual das 3 engines: [project/manual-3-engines-nextpro.md](./project/manual-3-engines-nextpro.md)
- Estado real do que existe (v0.6.17): [project/explicacao-engine-gamificacao-v0.6.17.md](./project/explicacao-engine-gamificacao-v0.6.17.md)

## Rodando localmente (apps/web)
### Pré-requisitos
- Node.js 18+
- Projeto Supabase (Cloud)

### Passo a passo
1) Instalar dependências
```bash
cd apps/web
npm install
```

2) Configurar env
- Criar `apps/web/.env` com:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

3) Rodar
```bash
npm run dev
```

### Migrations (Supabase Cloud)
As migrations ficam em `supabase/migrations/`. Aplique no Supabase (SQL Editor) em ordem crescente.

As mais recentes e relevantes para as engines:
- `19_engines_shared_seasons_nuclei.sql`
- `20_engines_shared_events_and_technical_rubrics.sql`

## Licença
Proprietário. Todos os direitos reservados.
