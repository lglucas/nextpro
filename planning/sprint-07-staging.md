# 🧪 Staging — Sprint 7 (Checkpoint + Fechamento)

**Sprint:** 7 (Avaliação Mensal & Algoritmo — MVP)  
**Tag:** `v0.7.12` / `sprint-07`  

## 1) Campos
- **URL do Staging:** (preencher)
- **Build/Release:** `v0.7.12`
- **Data do checkpoint:** (preencher)
- **Data do fechamento:** (preencher)
- **Responsável pela validação:** (preencher)

---

## 2) Checkpoint (meio do sprint)
### A. Saúde do deploy
- [ ] Build de produção passou (sem erros de runtime no console).
- [ ] Navegação base funciona (home, sidebar/menus, voltar, refresh).
- [ ] Sem erros 401/403 inesperados nas rotas principais.
- [ ] Sem erros de RLS para fluxos esperados.

### B. Fluxos por persona (smoke test)
**Atleta**
- [ ] Login e carregar app sem “tela branca”.
- [ ] Ver card do atleta e dados essenciais.
- [ ] Ver avaliação mensal (mês atual) no card.

**Professor (coach)**
- [ ] Prova mensal por turma abre e salva respostas.

**Gestor (school_admin)**
- [ ] Ver alunos e turmas.

**CTO (super_admin)**
- [ ] Rubricas mensais com pilar configurável (se aplicável).

### C. UI/UX (feedback rápido)
- [ ] Textos, labels e estados vazios estão claros.
- [ ] Caminhos estão “bons” (menos cliques, menos confusão).
- [ ] Registrar 3 melhorias de UI/UX com prioridade (P0/P1/P2).

---

## 3) Fechamento (fim do sprint, antes do próximo)
### A. Regressão mínima (obrigatória)
- [ ] Login/logout ok.
- [ ] RBAC ok (cada role vê o que deve, e não vê o que não deve).
- [ ] Fluxos centrais do sprint ok (mensal + card).
- [ ] Sem erros no console em navegação normal.

### B. Qualidade
- [x] Lint ok.
- [x] Build ok.
- [x] CHANGELOG atualizado (v0.7.12).

### C. Registro final
- [ ] Lista de correções obrigatórias concluída (P0).
- [ ] Lista de melhorias priorizada para o próximo sprint (P1/P2).
- [ ] “O que aprendemos” (3 bullets) registrado no relatório do sprint.

