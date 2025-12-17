# 📝 Relatório de Execução - Sprint 1

**Período:** 15/12/2025 - 21/12/2025  
**Status Final:** Concluído com Êxito (Escopo Estendido)

## 🎯 Resumo
A Sprint 1 focava no setup básico ("Hello World"). Conseguimos não apenas estabelecer a fundação (Monorepo, CI/CD, Design System), mas também adiantar funcionalidades críticas de autenticação e regras de negócio da Sprint 2 e 3.

## 🚀 Entregas Principais
1.  **Monorepo Setup:** Turborepo configurado e funcional.
2.  **Supabase Integration:** Cliente configurado e conectado à Cloud.
3.  **Sistema de Autenticação:** Login e Cadastro completos com validação.
4.  **RBAC (Role-Based Access Control):**
    *   Tabela `profiles` criada.
    *   Trigger automático: Email específico vira `super_admin`.
    *   Contexto React (`AuthContext`) expõe a role globalmente.

## 🐛 Problemas Encontrados & Soluções (Troubleshooting)

### 1. "O Grande Loop do Docker"
*   **Problema:** Tentativa de rodar Supabase via Docker no Windows gerou loops de erro, falhas de permissão e portas bloqueadas.
*   **Impacto:** Perda de tempo tentando debugar infraestrutura local.
*   **Solução:** Migração total para Supabase Cloud (Ver `ADR-001`).
*   **Lição:** Para MVPs rápidos, evite complexidade de infra local se a nuvem oferece tier gratuito robusto.

### 2. Git Nested Repositories
*   **Problema:** A pasta `apps/web` foi iniciada como um repositório Git dentro do repositório principal, causando conflitos de submodule.
*   **Solução:** Remoção da pasta `.git` interna e re-indexação no root.
*   **Lição:** Sempre verificar `git status` ao criar projetos com CLI de frameworks (Vite/Next) dentro de monorepos.

### 3. Tela Branca (Infinite Loading)
*   **Problema:** Após login, a tela ficava branca.
*   **Causa:** O `AuthContext` entrava em estado de loading infinito se a conexão com Supabase falhasse silenciosamente ou se a sessão viesse nula mas o loading não fosse setado para false.
*   **Solução:** Refatoração do `AuthContext` para garantir que `setLoading(false)` seja chamado em todos os caminhos (sucesso, erro, catch).

## ⏭️ Próximos Passos (Sprint 2)
*   Criar o **Painel do SuperAdmin** (já que agora temos a role).
*   Criar CRUD de Escolinhas (`Organizations`).
*   Configurar RLS para proteger dados entre escolas.
