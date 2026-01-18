# Rubricas Técnicas — V2 (expansão)

Objetivo: ampliar as opções de rubricas mantendo consistência de keys e sem quebrar a V1.

## O que muda
### Diário (pós‑treino)
Tabela: `technical_questions`
- Adiciona novas opções na **Base (slot 1)** com foco em Técnica/Tática/Mental.
- Adiciona novas opções por posição nos **slots 2 e 3**.
- **Impacto no app:** nenhum aumento de esforço por atleta (continua escolhendo 3 perguntas), apenas mais opções no catálogo.

### Mensal
Tabela: `technical_monthly_questions`
- Adiciona novas perguntas base e por posição com foco em rotina, profissionalismo, pressing/transições, etc.
- As perguntas novas entram como **`active = false`** para não aumentar automaticamente a carga do formulário mensal (que exige preencher todas as ativas).

## Seeds
- Migration: [25_seed_technical_rubrics_v2.sql](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/25_seed_technical_rubrics_v2.sql)

## Onde usar (professor)
- **Chamada:** Dashboard → Turmas → Chamada
- **Criar aula (sessão):** dentro da chamada, botão “Nova Aula”
- **Avaliar pós‑treino:** selecionar aula → botão “Pós‑treino”
- **Avaliação mensal:** selecionar “Avaliação mensal” (botão no topo da chamada) e preencher o mês

