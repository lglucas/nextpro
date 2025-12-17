# ADR 001: Migração de Supabase Local (Docker) para Supabase Cloud

**Status:** Aceito  
**Data:** 16/12/2025  
**Contexto:** Sprint 1 - Setup Inicial

## 1. Contexto e Problema
Inicialmente, o projeto foi configurado para rodar com **Supabase Local** via Docker, visando desenvolvimento offline e controle total da infraestrutura local. No entanto, enfrentamos os seguintes obstáculos no ambiente Windows do desenvolvedor:
1.  **Complexidade de Rede:** Erros recorrentes de conexão entre o container e o host (Windows).
2.  **Performance:** O Docker Desktop no Windows consome recursos significativos, impactando a IDE.
3.  **Complexidade de Setup:** A necessidade de rodar `supabase start` e gerenciar volumes Docker adicionava fricção desnecessária ao fluxo de trabalho ("DX" ruim).
4.  **Erros de Script:** Scripts de automação falhavam devido a diferenças de shell (PowerShell vs Bash).

## 2. Decisão
Decidimos **abandonar o setup local via Docker** e utilizar diretamente o **Supabase Cloud** (ambiente gerenciado) para desenvolvimento (`dev`), `staging` e `production`.

## 3. Consequências

### Positivas ✅
*   **Zero Infra:** Não é necessário gerenciar containers Docker locais.
*   **Setup Imediato:** Basta clonar o repo e preencher o `.env`.
*   **Paridade:** O ambiente de desenvolvimento é idêntico ao de produção (mesma engine, mesmas limitações).
*   **Estabilidade:** Fim dos erros de conexão `ECONNREFUSED` locais.

### Negativas ❌
*   **Dependência de Internet:** Não é possível programar totalmente offline.
*   **Dados Compartilhados (Cuidado):** Desenvolvedores precisam ter cuidado para não sobrescrever dados uns dos outros se usarem o mesmo projeto Cloud (mitigado criando projetos separados ou branches no Supabase).
*   **Latência:** Pequeno delay nas requisições (rede vs localhost), mas insignificante para desenvolvimento web.

## 4. Plano de Ação (Realizado)
1.  Removida pasta `supabase/` contendo configs do Docker.
2.  Atualizado `apps/web/.env` para apontar para URL da Cloud.
3.  Criado script SQL de migração (`init_auth_roles.sql`) para ser rodado manualmente no dashboard da Cloud.
4.  Atualizada documentação (`README.md`) removendo pré-requisito de Docker.
