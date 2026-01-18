# 🧪 Staging — Sprint 8 (Checkpoint + Fechamento)

**Sprint:** 8 (Financeiro e Bloqueio — MVP)  
**Build/Release:** `0.8.0`  

## 1) Campos
- **URL do Staging:** (preencher)
- **Build/Release:** `0.8.0`
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
Marcar apenas os que foram impactados.

**Atleta / Responsável / Fan**
- [ ] Usuário sem bloqueio acessa `/app` normalmente.
- [ ] Usuário bloqueado é redirecionado para `/app/bloqueado`.
- [ ] Tela de bloqueio exibe mensagem e permite sair.

**Gestor (school_admin)**
- [ ] Ajustar `financial_status` do aluno na listagem.
- [ ] Encontrar rapidamente alunos `blocked` (filtro/organização).

### C. UI/UX (feedback rápido)
- [ ] Textos, labels e estados vazios estão claros.
- [ ] Itens sem ação estão ocultos ou desabilitados.
- [ ] Registrar 3 melhorias de UI/UX com prioridade (P0/P1/P2).

---

## 3) Fechamento (fim do sprint, antes do próximo)
### A. Regressão mínima (obrigatória)
- [ ] Login/logout ok.
- [ ] RBAC ok (cada role vê o que deve, e não vê o que não deve).
- [ ] Fluxos centrais do sprint ok (bloqueio + gestão).
- [ ] Sem erros no console em navegação normal.

### B. Qualidade
- [ ] Lint ok.
- [ ] Build ok.
- [ ] CHANGELOG atualizado (0.8.0).

### C. Registro final
- [ ] Lista de correções obrigatórias concluída (P0).
- [ ] Lista de melhorias priorizada para o próximo sprint (P1/P2).
- [ ] “O que aprendemos” (3 bullets) registrado.

