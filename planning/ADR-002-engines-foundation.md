# ADR-002: Fundações das 3 Engines (shared + catálogos versionados)

## Status
Aceito

## Contexto
O produto NextPro depende de 3 engines independentes (Técnica, Social e Benefícios) que precisam ser integráveis sem conflitar entre si. Para isso, é necessário estabelecer uma camada comum (shared) com governança temporal (temporadas), estrutura operacional (núcleos) e uma trilha de eventos auditáveis para permitir:
- comparabilidade por ano/temporada
- idempotência e auditoria de pontos/eventos
- evolução modular por sprint (sem “cabeça de MVP”)

## Decisão
- Criar tabela de temporadas anuais com apenas uma temporada ativa.
- Criar entidade de núcleo e vínculo escola ↔ núcleo por temporada.
- Criar trilha genérica de eventos por engine para armazenar fatos auditáveis com idempotência por origem.
- Criar catálogo técnico versionado de perguntas por temporada, separando perguntas base e por posição.
- Administrar essas entidades via Cantinho do CTO (super_admin).

## Consequências
- Sprint 6 e 7 passam a depender dessas fundações para registrar avaliações por temporada e gerar rankings.
- A engine social e benefícios podem usar a trilha de eventos sem reestruturar banco depois.
- O banco fica pronto para implementar reputação/Pinóquio e ponderação multi-fonte em sprints seguintes.

