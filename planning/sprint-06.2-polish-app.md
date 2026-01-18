# Sprint 6.2 — App Polish (MVP operacional)

Objetivo: eliminar mocks/atalhos quebrados e integrar dados reais já existentes, consolidando uma experiência coerente para atleta e professor.

**Status:** ✅ Concluído (2026-01-18)

## Escopo
### App (atleta)
- Substituir “Próximo Jogo” por “Próximo treino” (dados reais via `class_sessions`).
- Substituir “Frequência” por cálculo real (últimos 10 treinos via `attendances`).
- Remover ou readequar botões sem ação (ex.: “Agendar treino”).
- Melhorar navegação para o dashboard quando o papel permitir (inclui coach).

### Dashboard (professor/gestor)
- Remover/ocultar itens que redirecionam (ex.: “Relatórios”) até existir conteúdo.
- Remover/ocultar botões sem ação na home do dashboard.

### Qualidade
- Garantir `npm run lint` e `npm run build` verdes.
- Atualizar changelog (Unreleased).

## Ambiente de testes (Staging)
### Checkpoint (meio do sprint)
- Deploy em Staging com ~50% do escopo (ou a cada ~10–12 mudanças relevantes).
- Smoke test dos fluxos do atleta e do professor/gestor.
- Registro rápido de caminhos quebrados e ajustes de UI/UX antes de seguir.

### Fechamento (antes do próximo sprint)
- Deploy em Staging com o sprint fechado.
- Checklist de regressão (app + dashboard) e console limpo.
- Lista de melhorias/sugestões para priorizar na próxima sprint.

## Fora de escopo (por enquanto)
- Calendário completo de treinos (recorrência por `classes.days`).
- Jogos/partidas (entidade própria).
- Notificações push/e-mail.

## DoD
- Nenhum texto mockado no app que pareça dado real (“Eagles FC”, etc).
- Páginas com dados ausentes exibem estado vazio claro.
- Sem links `to="#"` em cards.
- Lint/build ok.

## Pendências (não realizadas)
- **Dashboard (KPIs reais):** Implementar “Taxa de Presença” e “Avaliações” com dados reais (baseado em `attendances` e `engine_events`).
- **Dashboard (UI):** Decidir se “Relatórios” vira uma página real (e qual) ou fica fora do menu.
