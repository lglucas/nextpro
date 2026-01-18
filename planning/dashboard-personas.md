# Dashboard por persona (app vs backoffice)

O projeto tem duas áreas principais:

## 1) App (atleta/família)
Base: `/app`

Objetivo: experiência do atleta (rotina, check‑in, histórico, perfil).

Páginas atuais:
- `/app` (home)
- `/app/check-in`
- `/app/tecnico`
- `/app/meu-perfil`

## 2) Backoffice (dashboard)
Base: `/dashboard`

Objetivo: operação da escolinha e visão institucional (CTO/Partner).

### Landing por role
- `coach` e `school_admin` → `/dashboard/operacao`
- `partner` → `/dashboard/partner`
- `super_admin` → `/dashboard/overview`

### Páginas por persona
**Coach / School Admin**
- Operação: turmas, chamada, sessões, pós‑treino, avaliação mensal.

**Partner**
- Visão macro: métricas agregadas e acompanhamento do ecossistema.
- Não é área de operação (não é onde se faz gestão diária de alunos/turmas).

**Super Admin**
- Visão macro + auditoria + Cantinho do CTO (engines e configurações).

