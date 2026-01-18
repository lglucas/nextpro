# Sprint 6.2 — App Polish (MVP operacional)

Objetivo: eliminar mocks/atalhos quebrados e integrar dados reais já existentes, consolidando uma experiência coerente para atleta e professor.

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

## Fora de escopo (por enquanto)
- Calendário completo de treinos (recorrência por `classes.days`).
- Jogos/partidas (entidade própria).
- Notificações push/e-mail.

## DoD
- Nenhum texto mockado no app que pareça dado real (“Eagles FC”, etc).
- Páginas com dados ausentes exibem estado vazio claro.
- Sem links `to="#"` em cards.
- Lint/build ok.

