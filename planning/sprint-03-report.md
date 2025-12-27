# 📝 Relatório de Execução - Sprint 3 (Parcial)
**Período:** 29/12/2025 - 04/01/2026 (Estimado)  
**Status Atual:** Em andamento

## 🎯 Resumo
Esta sprint foca em consolidar a operação por persona (SchoolAdmin / Sócio / CTO) e avançar a base de dados real (alunos, turmas e vínculos), além de iniciar a camada de compliance mínima com Termos de Uso.

## ✅ Entregas Realizadas (até agora)

### 1) Persona / QA de UI (CTO)
- Modo de visualização (troca de persona) disponível apenas para `super_admin` para validar telas e menus por perfil.

### 2) Captura de Leads (Contato)
- Página `/contato` grava mensagens no Supabase em `contact_messages`.
- Anti-spam opcional com Cloudflare Turnstile (quando configurado por `.env`).

### 3) Legal (Termos de Uso)
- Gate de aceite obrigatório para acessar `/app` e `/dashboard`.
- Registro de aceite com versão e evidências mínimas (IP/User-Agent/Meta) em `terms_acceptances`.

## 🧪 Validação (Checklist)
- Turnstile funcionando localmente com `VITE_TURNSTILE_SITE_KEY` + Edge Function no Supabase.
- Inserts confirmados em `contact_messages`.
- Inserts confirmados em `terms_acceptances` e liberação do gate após aceite.

## 🔜 Próximos Passos (Sprint 3)
- Importação CSV de alunos (mínimo viável).
- Completar CRUD (edição/exclusão) em alunos e turmas.
- Evoluir o termo (conteúdo e versão) e definir política de atualização/renovação.

