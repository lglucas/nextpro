# Relatório de Status (2026-01-17) — Cronograma por Sprints

Este relatório resume onde o projeto está em relação ao cronograma de sprints, o que foi entregue e quais são os próximos passos recomendados.

**Atualização (2026-01-18):** Sprint 6 e Sprint 7 foram fechados (MVP) e o fechamento do Sprint 7 foi tagueado como `v0.7.12` / `sprint-07`.

## 1) Onde estamos agora
- **Fase atual:** Fase 2 (Core Loop) com fundações das engines prontas (Sprint 5.1).
- **Versão de referência no repo:** v0.7.0.
- **Condição para avançar:** iniciar Sprint 6 (avaliação técnica diária) consumindo `technical_questions` e registrando eventos por temporada.

### Situação vs cronograma (adiantado/atrasado)
Comparando com as datas do roadmap:
- Em **2026-01-17**, o cronograma coloca o time ainda dentro do **Sprint 5** (12/01–18/01).
- Como já entregamos também o **Sprint 5.1** (planejado para 19/01–25/01), o projeto está **adiantado ~1 sprint** no eixo “engine foundations”.
- Em termos de calendário, isso significa estar adiantado em **~2 dias** versus o início do Sprint 5.1 e **~8 dias** versus o fim do Sprint 5.1.

## 2) Status por sprint (planejado vs entregue)
Fonte do plano: [1-roadmap-sprints.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/planning/1-roadmap-sprints.md)

### Sprint 1 — Setup & Alicerce
- **Status:** ✅ Entregue
- **Entregas relevantes:** estrutura do monorepo (apps/web), base Supabase, autenticação e perfis.

### Sprint 2 — Gestão de Entidades & Dashboard
- **Status:** ✅ Entregue
- **Entregas relevantes:** dashboard, RBAC inicial, Cantinho do CTO, relatórios PDF.

### Sprint 2.5 — Site público & Pré‑Cadastro
- **Status:** ✅ Entregue
- **Entregas relevantes:** site institucional, formulário de contato, wizard pré‑cadastro e gestão no CTO.

### Sprint 3 — Cadastro e operação de Alunos/Turmas
- **Status:** ✅ Entregue
- **Entregas relevantes:** CRUD de alunos e turmas, matrículas, importação CSV, foto do aluno (upload/remover).

### Sprint 4 — Presença e QR Check-in
- **Status:** ✅ Entregue
- **Entregas relevantes:** chamada manual, QR check-in (atleta) e regra de integridade (aluno inativo não marca “presente”).

### Sprint 5 — Gamificação (Parte 1)
- **Status:** ✅ Entregue (base)
- **Entregas relevantes:** XP por presença (trigger), nível por XP, trilha idempotente de eventos e card do atleta no perfil.

### Sprint 5.1 — Engines (Técnica + Social + Benefícios) — Fundações
- **Status:** ✅ Entregue
- **Entregas relevantes:**
  - temporadas (`seasons`)
  - núcleos (`nuclei`) e vínculo escola→núcleo por temporada (`school_nuclei`)
  - trilha de eventos por engine (`engine_events`)
  - catálogo de rubricas técnicas (`technical_questions`)
  - CRUD no CTO para administrar essas entidades

### Sprint 6 — Avaliação Técnica Diária
- **Status:** ⏳ Próximo (não iniciado)
- **Dependências já prontas:** temporadas, rubricas e trilha de eventos (Sprint 5.1).

### Sprint 7 — Avaliação Mensal & Algoritmo
- **Status:** ⏳ Planejado

### Sprint 8 — Financeiro e bloqueio
- **Status:** ⏳ Planejado

### Sprint 9 — Feed Social e Comunidade
- **Status:** ⏳ Planejado

### Sprint 10 — Marketplace & Benefícios
- **Status:** ⏳ Planejado

### Sprint 11 — Testes e Polish
- **Status:** ⏳ Planejado

### Sprint 12 — Go-Live
- **Status:** ⏳ Planejado

## 3) Resumo do que já foi feito (por “módulos de produto”)
### Operação da escolinha (core loop)
- Turmas e matrículas
- Alunos (CRUD + ativar/inativar + foto)
- Presença (chamada manual + QR check-in)

### Gamificação (base)
- XP por presença + progressão por nível
- trilha auditável/idempotente de eventos de XP
- card de atleta no perfil

### Engines (fundações)
- temporada e núcleo como base de histórico
- trilha de eventos por engine para auditoria
- rubricas técnicas versionadas por temporada/posição

## 4) Próximos passos recomendados
### Próximo sprint (Sprint 6 — avaliação técnica diária)
- Criar fluxo “pós‑treino” do técnico:
  - gating obrigatório 3 piores → 3 melhores
  - 3 perguntas por atleta (0–10) usando `technical_questions`
- Registrar cada resposta como evento técnico auditável por temporada (via `engine_events`).
- Gerar primeiras agregações simples para visualização interna (ex.: contagem por posição, histórico por temporada).

### Em paralelo (qualidade e operação)
- Reforçar logs/auditoria onde necessário (sem travar UX).
- Definir o conjunto inicial de posições do produto (as mesmas da UI de rubricas) e padronizar nomes.
