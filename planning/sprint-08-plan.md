# Planejamento Sprint 8: Financeiro e Bloqueio

**Período (roadmap):** 02/02/2026 - 08/02/2026  
**Foco:** Bloqueio financeiro (MVP) e fluxo de gestão de inadimplência.

## Objetivo
Dar ao SchoolAdmin um controle simples de inadimplência e impedir acesso ao app (atleta/responsável/fan) quando houver bloqueio financeiro.

## Escopo (MVP)
### Banco de Dados (Supabase)
- `students.financial_status`: `active | warning | blocked`.

### Dashboard (SchoolAdmin)
- Ajustar status financeiro do aluno na listagem.
- Filtro/organização para encontrar rapidamente alunos bloqueados (MVP).

### App (atleta/responsável/fan)
- Gate de acesso: se existir bloqueio financeiro associado ao usuário, redirecionar para tela de bloqueio.
- Tela de bloqueio: texto curto e opção de sair.

## Fora de escopo (por enquanto)
- Cobrança integrada / pagamentos.
- Regras automáticas por dias de atraso.
- Notificações (push/e-mail/WhatsApp).

## Ambiente de testes (Staging)
Template padrão: [staging-checklist-template.md](./staging-checklist-template.md)

Registro do gate deste sprint:
- Checkpoint (meio): [sprint-08-staging.md](./sprint-08-staging.md)
- Fechamento (fim): [sprint-08-staging.md](./sprint-08-staging.md)

