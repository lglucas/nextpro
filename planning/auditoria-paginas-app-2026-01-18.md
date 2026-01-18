# Auditoria de Páginas (2026-01-18)

Objetivo: revisar todas as páginas existentes (site, app e dashboard), identificar mocks, lacunas e integrações pendentes e propor melhorias.

## 1) Inventário de rotas (atual)
Fonte: [App.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/App.tsx)

### Site público (`/`)
- `/` (home)
- `/projeto`, `/pais`, `/atletas`, `/escolinhas`, `/como-funciona`, `/faq`
- `/contato`, `/termos`, `/privacidade`, `/blog`, `/parceiros`
- `/pre-cadastro`

### Auth
- `/login`, `/register`

### App (área logada) (`/app`)
- `/app` (home)
- `/app/meu-perfil`
- `/app/check-in`
- `/app/tecnico` (histórico técnico)
- `/app/aceite-termos`

### Dashboard (admin/escola) (`/dashboard`)
- `/dashboard` (visão geral)
- `/dashboard/schools` (super_admin)
- `/dashboard/settings` (super_admin)
- `/dashboard/students` (school_admin/super_admin/coach)
- `/dashboard/classes` (school_admin/super_admin/coach)
- `/dashboard/pre-cadastros` (school_admin/super_admin)
- `/dashboard/classes/:id/attendance`
- `/dashboard/classes/:id/sessions/:sessionId/post-treino`
- `/dashboard/classes/:id/sessions/:sessionId/resumo-tecnico`
- `/dashboard/attendance` (atalho → classes)
- `/dashboard/reports` (atalho → dashboard)

## 2) Achados (mocks, lacunas e integrações pendentes)

### App (`/app`)
**Home do atleta** — [Home.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/home/pages/Home.tsx)
- Existe conteúdo mockado:
  - “Próximo Jogo” com texto fixo (“vs Eagles FC”) e link `to="#"`.
  - “Frequência” com números fixos (8/10) e barra fixa (80%).
  - Botão “Agendar Treino” sem ação (placeholder).
- Melhoria recomendada:
  - Substituir por **Próximo treino** (próxima `class_sessions` das turmas do atleta).
  - Calcular **frequência real** baseada em `attendances` (últimos 10 treinos).
  - Se não houver dados, exibir estado vazio coerente (“Em breve”/“Sem treinos registrados”).

**Navegação para o dashboard (papéis)** — [AppLayout.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/layouts/AppLayout.tsx)
- Coach não aparece como elegível para “Área Administrativa”.
- Isso cria fricção porque o coach tem páginas ativas no dashboard (turmas/chamada).
- Melhoria recomendada: incluir `coach` no acesso ao link do dashboard.

**Histórico técnico do atleta** — [TechnicalHistoryPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/technical/pages/TechnicalHistoryPage.tsx)
- Funciona com `engine_events` (technical_daily).
- Pontos de melhoria:
  - Exibir mais itens por treino (hoje limita a 6 por grupo).
  - Normalizar agrupamento por sessão com ordenação consistente.

### Dashboard (`/dashboard`)
**Sidebar: links não-funcionais**
- “Relatórios” aponta para `/dashboard/reports`, mas hoje redireciona para a home do dashboard.
- Melhoria recomendada: esconder o item até existir página real ou apontar para algo funcional.

**Visão geral** — [Dashboard.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/dashboard/pages/Dashboard.tsx)
- KPIs “Taxa de Presença” e “Avaliações” estão marcados como “Em breve”.
- Botão “Novo Relatório” não tem ação.
- Melhoria recomendada: ou remover/ocultar botões sem ação, ou implementar uma ação real (ex.: exportar PDF já existe; “Novo relatório” pode virar atalho para “Exportar PDF”/“Relatório de presença”).

**Resumo técnico por sessão** — [SessionTechnicalSummaryPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/school/pages/SessionTechnicalSummaryPage.tsx)
- Depende de leitura de `engine_events` por coach/school_admin.
- Requisito: policy de select para coach (migration 22).

### Site público
**Blog e Parceiros** — [BlogPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/site/pages/BlogPage.tsx) e [ParceirosPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/site/pages/ParceirosPage.tsx)
- Texto “Em breve” é aceitável como placeholder institucional.
- Melhoria opcional: esconder do menu até ter conteúdo, ou manter com mensagem clara (já está).

## 3) Recomendações (prioridade)
### Alta (reduz ruído e aumenta credibilidade)
- Remover/substituir mocks do `/app` (Home do atleta).
- Ajustar gating de navegação (coach com acesso visível ao dashboard).
- Esconder/ajustar links e botões sem ação no dashboard.

### Média (melhora experiência e retenção)
- Melhorar histórico técnico do atleta (agregação, ordenação, paginação).

### Baixa (polish)
- Revisar copy e consistência visual (“Em breve” vs “—”) em lugares de placeholder.

## 4) Pendências registradas
- **Dashboard (KPIs reais):** Implementar “Taxa de Presença” e “Avaliações” com dados reais (baseado em `attendances` e `engine_events`). Mantido como pendente para seguir o sprint normal.

