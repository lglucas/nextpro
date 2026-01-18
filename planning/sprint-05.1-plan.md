# Planejamento Sprint 5.1: Fundações das 3 Engines (Técnica, Social e Benefícios)

**Período:** 19/01/2026 - 25/01/2026  
**Foco:** Preparar o produto “final” das 3 engines de forma modular, com dados auditáveis, governança temporal e catálogos versionados, sem ainda entregar as telas completas de avaliação pós‑treino/mensal e social.

## Objetivos
- Consolidar o desenho do produto das 3 engines em planejamento implementável.
- Criar a camada comum (shared) para temporadas, núcleos e trilha de eventos.
- Criar o catálogo técnico versionado (rubricas/perguntas) administrável via CTO.
- Garantir RLS e estrutura pronta para evoluir Sprint 6 (avaliação técnica diária) e Sprint 7 (mensal).

## Entradas (documentos de referência)
- Manual completo das 3 engines: [manual-3-engines-nextpro.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/manual-3-engines-nextpro.md)
- Conversas e contexto: [conversas-sobre-o-engine.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/conversas-sobre-o-engine.md)
- Explicação fiel do que existe hoje: [explicacao-engine-gamificacao-v0.6.17.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/explicacao-engine-gamificacao-v0.6.17.md)
- Respostas e decisões: [respondendo.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/respondendo.md) e [respondendo2.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/project/respondendo2.md)

## Escopo (o que entra)
### 1) Shared: Temporadas e Núcleos
- Temporadas anuais (2026, 2025, etc) com uma temporada ativa.
- Núcleos como agrupamento operacional de escolas.
- Vínculo escola ↔ núcleo por temporada (uma escola pertence a um núcleo por temporada).

### 2) Shared: Trilha de eventos auditáveis (base)
- Tabela genérica de eventos para registrar fatos relevantes por engine (técnico/social/benefícios).
- Idempotência por source (evitar duplicidade por origem).
- Leitura por papel (super admin, escola, atleta) via RLS.

### 3) Engine Técnica: Catálogo versionado de rubricas/perguntas
- Banco de perguntas técnico por temporada.
- Separação entre perguntas “base” (slot 1) e perguntas por posição (slots 2 e 3).
- Gestão via Cantinho do CTO (criar/editar/desativar).

### 4) CTO (Admin)
- Aba no Cantinho do CTO para gerir:
  - Temporadas
  - Núcleos e vínculo escolas ↔ núcleos
  - Rubricas/Perguntas técnicas

## Fora de escopo (o que não entra)
- Implementar a UI do treinador com “3 piores → 3 melhores” (Sprint 6).
- Implementar a prova mensal 20–40 perguntas por atleta (Sprint 7).
- Implementar engine social (moedas, presentes, fanbase, tiers 15 dias).
- Implementar engine de benefícios (marketplace/cashback).
- Implementar reputação/Pinóquio (fica para Sprint 5.1.1/6.1 conforme planejamento).

## Critérios de pronto (DoD)
- Migrations aplicadas no Supabase com RLS funcional.
- CTO consegue cadastrar temporadas, núcleos e perguntas técnicas.
- Projeto compila e passa lint/build.
- CHANGELOG atualizado com a versão do ciclo.

## Ambiente de testes (Staging)
### Checkpoint (meio do sprint)
- Deploy em Staging com ~50% do escopo (ou a cada ~10–12 mudanças relevantes).
- Smoke test dos fluxos do CTO (temporadas, núcleos, rubricas) e navegação.
- Registro rápido de melhorias de UI/UX e correções antes de seguir.

### Fechamento (antes do próximo sprint)
- Deploy em Staging com o sprint fechado.
- Checklist de regressão dos fluxos do CTO e RLS (roles principais).
- Lista de melhorias/sugestões para priorizar na próxima sprint.

## Testes manuais recomendados
- Criar temporada 2026 e marcar como ativa.
- Criar núcleo e vincular uma escola na temporada ativa.
- Criar perguntas base e por posição, verificar listagem e edição no CTO.

