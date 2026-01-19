# Template — Checklist de Staging (Gate no meio e no fim do Sprint)

Este documento é o template único para validação em **ambiente de testes (Staging)**.

Use em todos os sprints:
- **Checkpoint (meio do sprint):** quando atingir ~50% do escopo ou a cada ~10–12 mudanças relevantes.
- **Fechamento (fim do sprint):** antes de iniciar o próximo sprint.

---

## 1) Como usar (copiar/colar)
1. Crie uma seção “Ambiente de testes (Staging)” no documento do sprint.
2. Cole os blocos “Checkpoint” e “Fechamento”.
3. Marque ✅/❌ e registre links/prints quando necessário.
4. Ao final, gere uma lista curta: **Correções** (obrigatórias) e **Melhorias** (backlog).

---

## 2) Checkpoint (meio do sprint)
### A. Saúde do deploy
- [ ] Build de produção passou (sem erros de runtime no console).
- [ ] Navegação base funciona (home, sidebar/menus, voltar, refresh).
- [ ] Sem erros 401/403 inesperados nas rotas principais.
- [ ] Sem erros de RLS para fluxos esperados.

### B. Fluxos por persona (smoke test)
Marcar apenas os que foram impactados no sprint.

**Atleta**
- [ ] Login e carregar app sem “tela branca”.
- [ ] Ver card do atleta e dados essenciais.
- [ ] Ver presença/próximo treino (se aplicável).
- [ ] Ver histórico/skill tree/avaliações (se aplicável).

**Professor (coach)**
- [ ] Ver turmas e lista de alunos.
- [ ] Chamada/presença (manual/QR) (se aplicável).
- [ ] Pós‑treino (avaliação diária) (se aplicável).
- [ ] Prova mensal por turma (se aplicável).

**Gestor (school_admin)**
- [ ] CRUD de alunos e turmas (inclui matrícula).
- [ ] Relatórios/exportações (se aplicável).
- [ ] Ver dados apenas da própria escola.

**CTO (super_admin)**
- [ ] CTOCorner abre e carrega abas principais.
- [ ] Engines: temporadas, núcleos, rubricas (diárias/mensais) (se aplicável).
- [ ] Reputação/Pinóquio (se aplicável).

### C. UI/UX (feedback rápido)
- [ ] Textos, labels e estados vazios estão claros.
- [ ] Caminhos estão “bons” (menos cliques, menos confusão).
- [ ] Itens sem ação estão ocultos ou desabilitados.
- [ ] Registrar 3 melhorias de UI/UX com prioridade (P0/P1/P2).

---

## 3) Fechamento (fim do sprint, antes do próximo)
### A. Regressão mínima (obrigatória)
- [ ] Login/logout ok.
- [ ] RBAC ok (cada role vê o que deve, e não vê o que não deve).
- [ ] Fluxos centrais do sprint ok (fim a fim).
- [ ] Sem erros no console em navegação normal.

### B. Qualidade
- [ ] Lint ok.
- [ ] Build ok.
- [ ] CHANGELOG atualizado (se houver release/ciclo).

### C. Registro final
- [ ] Lista de correções obrigatórias concluída (P0).
- [ ] Lista de melhorias priorizada para o próximo sprint (P1/P2).
- [ ] “O que aprendemos” (3 bullets) registrado no relatório do sprint.

---

## 4) Campos para preencher no sprint
- **URL do Staging:** 
- **Build/Release:** 
- **Data do checkpoint:** 
- **Data do fechamento:** 
- **Responsável pela validação:** 

