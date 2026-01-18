# 🧪 Staging — Sprint 7 (Checkpoint + Fechamento)

**Sprint:** 7 (Avaliação Mensal & Algoritmo — MVP)  
**Tag:** `v0.7.12` / `sprint-07`  

## 1) Campos
- **URL do Staging:** Local (dev) — `http://localhost:5173`
- **Build/Release:** `v0.7.12`
- **Data do checkpoint:** 18/01/2026
- **Data do fechamento:** 18/01/2026
- **Responsável pela validação:** Lucas L Galvão (CTO)

---

## 2) Checkpoint (meio do sprint)
### A. Saúde do deploy
- [x] Build de produção passou (sem erros de runtime no console).
- [x] Navegação base funciona (home, sidebar/menus, voltar, refresh).
- [x] Sem erros 401/403 inesperados nas rotas principais.
- [x] Sem erros de RLS para fluxos esperados.

### B. Fluxos por persona (smoke test)
**Atleta**
- [x] Login e carregar app sem “tela branca”.
- [x] Ver card do atleta e dados essenciais.
- [x] Ver avaliação mensal (mês atual) no card.

**Professor (coach)**
- [x] Prova mensal por turma abre e salva respostas.

**Gestor (school_admin)**
- [x] Ver alunos e turmas.

**CTO (super_admin)**
- [x] Rubricas mensais com pilar configurável (se aplicável).

### C. UI/UX (feedback rápido)
- [x] Textos, labels e estados vazios estão claros.
- [x] Caminhos estão “bons” (menos cliques, menos confusão).
- [x] Registrar 3 melhorias de UI/UX com prioridade (P0/P1/P2).

Melhorias registradas:
- P0: `npm run build` no root não existia (usar `apps/web` ou adicionar script no root).
- P1: Dashboard “Log de Atividades” mostra “Sistema” em vez do ator (resolver via `actor_id`/profiles).
- P1: Ao voltar do alt+tab em dev, tela pode demorar ~4–5s para renderizar (investigar refresh/token/queries).

---

## 3) Fechamento (fim do sprint, antes do próximo)
### A. Regressão mínima (obrigatória)
- [x] Login/logout ok.
- [x] RBAC ok (cada role vê o que deve, e não vê o que não deve).
- [x] Fluxos centrais do sprint ok (mensal + card).
- [x] Sem erros no console em navegação normal.

### B. Qualidade
- [x] Lint ok.
- [x] Build ok.
- [x] CHANGELOG atualizado (v0.7.12).

### C. Registro final
- [ ] Lista de correções obrigatórias concluída (P0).
- [x] Lista de melhorias priorizada para o próximo sprint (P1/P2).
- [x] “O que aprendemos” (3 bullets) registrado no relatório do sprint.

O que aprendemos:
- O build/lint precisa rodar no workspace correto (root deve ter scripts de atalho).
- Logs de auditoria precisam resolver autor por `actor_id` (não “Sistema”).
- Sessões “pendentes” significam “chamada não salva”; pós‑treino depende de chamada salva.

