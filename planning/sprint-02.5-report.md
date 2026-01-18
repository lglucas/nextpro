# 📝 Relatório de Execução - Sprint 2.5 (Site Público + Pré‑Cadastro)
**Período:** 26/12/2025  
**Status Final:** Concluída (MVP v0.6.13)

## 🎯 Resumo
Nesta sprint, entregamos o **site público institucional** e o **pré‑cadastro (wizard do censo familiar)** com persistência e trilha mínima de consentimento. Também deixamos o time de gestão (Sócios/CTO) capaz de **visualizar** os pré‑cadastros e **mover o status de onboarding** do funil.

Release do marco: **v0.6.13**.

## ✅ Entregas Realizadas

### 1) Site Público (Institucional)
- Site multi‑páginas com navegação e rodapé.
- CTA “Entrar” integrado ao fluxo de autenticação do app.
- Rota de pré‑cadastro `/pre-cadastro` mantida “sem link no menu”.

### 2) Pré‑Cadastro (Wizard do Censo)
- Wizard com etapas: Responsável → Escolinha → Filhos → Censo → Confirmação.
- Persistência dupla:
  - rascunho no `localStorage` (retomada rápida),
  - rascunho/envio no Supabase (`pre_registrations`).
- Envio final com validações por etapa.
- Anti‑spam básico no envio (honeypot invisível).

### 3) Banco de Dados (Supabase) + Segurança (RLS)
- Tabela `pre_registrations` com dados do wizard em JSON (`data`) e status.
- Tabela `school_suggestions` para registrar escolinha informada quando não houver cadastro prévio.
- Policies RLS:
  - usuário gerencia o próprio pré‑cadastro (por `user_id`),
  - SuperAdmin gerencia tudo via CTO.
- Onboarding do funil e trilha mínima de consentimento:
  - `onboarding_status`: `pendente_escola → aguardando_contrato → ativo` (e `rejeitado`),
  - `consented_at`, `consent_version`, `submitted_meta`.

### 4) Área Administrativa (Sócios/CTO)
- Aba de pré‑cadastros com busca/filtro e visualização do payload.
- Edição do `onboarding_status` diretamente na listagem, para registros enviados.
- Exibição das evidências mínimas de consentimento e meta do envio.

## 🧪 Validação (Checklist)
- Migração SQL aplicada com sucesso no Supabase.
- Envio real de pré‑cadastro validado (colunas novas preenchidas).
- Visualização e edição do status testadas no CTO.
- `npm run lint` e `npm run build` executados com sucesso.

## Ambiente de testes (Staging)
### Checkpoint (meio do sprint)
- Deploy em Staging com ~50% do escopo (ou a cada ~10–12 mudanças relevantes).
- Smoke test dos fluxos impactados e revisão de caminhos/navegação.
- Registro rápido de ajustes de UI/UX antes de seguir.

### Fechamento (antes do próximo sprint)
- Deploy em Staging com o sprint fechado.
- Checklist de regressão dos fluxos principais + console limpo.
- Lista de melhorias/sugestões para priorizar na próxima sprint.

## 🔜 Pendências (Escopo Adiado / Próximas Iterações)
- Captura de leads (formulário de contato) e eventos de métricas (GA/Meta).
- Captcha “forte” (ex.: Cloudflare Turnstile/reCAPTCHA) além do honeypot.
- Confirmação por escolinha (painel dedicado para SchoolAdmin aceitar/rejeitar).
- Assinatura eletrônica forte com evidências e trilha auditável (DocuSign/Clicksign).

