# Engine de Gamificação (v0.6.17) — Explicação fiel ao código

Este documento descreve, com fidelidade ao repositório, como a Engine de Gamificação foi implementada na versão **v0.6.17** (data 2026-01-10), cobrindo:
- Estrutura do banco (tabelas, políticas, triggers e funções)
- Fluxo de XP por presença (idempotência, reversão, consistência)
- O que “badges/tiers” já está pronto e o que ainda não foi implementado
- O que a UI entrega hoje (Check-in e Meu Perfil)
- Pontos de atenção e melhorias sugeridas

## 1) Objetivo e escopo real do que foi entregue

O Sprint 5 (“Gamificação Parte 1 - Engine”) no roadmap pede:
- Estrutura de Badges (badges + tiers)
- Trigger de pontos: presença = +10 XP
- Level up: lógica (com animação na tela)
- Perfil do atleta (card com foto e nível)

No código atual, foi entregue:
- **Banco (engine base):** XP total e nível por atleta + trilha de eventos de XP para idempotência.
- **Trigger real de XP:** qualquer `attendance` com `status = 'present'` gera XP automaticamente no banco.
- **Estrutura de badges/tiers:** tabelas e permissões de leitura prontas (ainda sem “regras” automáticas de conquista).
- **UI:** após check-in o app mostra XP/nível e um aviso simples de level up; em “Meu perfil” existe um card no estilo “FUT Card”.

Referências principais:
- Migração da engine: [09_create_gamification_engine.sql](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/09_create_gamification_engine.sql)
- Check-in (UI): [CheckInPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/attendance/pages/CheckInPage.tsx)
- Meu Perfil (FUT Card): [MeuPerfilPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/profile/pages/MeuPerfilPage.tsx)

## 2) Banco de Dados — Tabelas criadas e para que servem

Tudo abaixo foi criado em `public.*` via migração [09_create_gamification_engine.sql](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/09_create_gamification_engine.sql).

### 2.1 `tiers` (horizontais)

Finalidade: catálogo de tiers (Bronze/Prata/Ouro/Platina/Diamante) para serem usados por badges.

Campos:
- `id` (uuid PK)
- `key` (texto, único): `bronze|prata|ouro|platina|diamante`
- `name` (texto): nome exibível
- `rank` (int >= 1): ordenação/crescimento
- `created_at`

Seeds:
- a migração já insere os 5 tiers com `on conflict (key) do nothing;` (evita duplicar se rodar de novo).

RLS (Row Level Security):
- Qualquer usuário autenticado pode **ler**.
- Apenas `super_admin` pode **gerenciar** (insert/update/delete).

### 2.2 `badges` (verticais)

Finalidade: catálogo de badges (categoria vertical).

Campos:
- `id` (uuid PK)
- `key` (texto, único): identificador estável (ex.: `rato_de_treino`)
- `name` (texto): nome exibível
- `description` (texto, opcional)
- `category` (texto, opcional)
- `created_at`

Observação importante (profundidade atual):
- **Ainda não existe seed de badges** (nenhum badge padrão é inserido automaticamente).
- **Ainda não existe lógica automática** que “desbloqueia” badges baseado em regras.

RLS:
- Qualquer usuário autenticado pode **ler**.
- Apenas `super_admin` pode **gerenciar**.

### 2.3 `student_progress` (XP e nível por atleta)

Finalidade: “estado atual” de progressão por atleta. É o que a UI consulta para mostrar nível e XP.

Campos:
- `student_id` (PK, FK → `students.id`)
- `xp_total` (int >= 0, default 0)
- `level` (int >= 1, default 1)
- `updated_at`

RLS (somente leitura):
- `super_admin` lê tudo.
- `school_admin` lê apenas alunos da mesma escola.
- usuário atleta lê apenas o próprio progresso (ligado via `students.user_id = auth.uid()`).

Observação importante:
- Não foi criada policy de escrita para o frontend. A escrita acontece via **trigger/funções** no banco.

### 2.4 `student_xp_events` (eventos de XP, idempotência e auditoria)

Finalidade:
- Guardar “por que” e “de onde” veio um XP.
- Garantir idempotência: a mesma fonte não dá XP duas vezes.

Campos:
- `id` (uuid PK)
- `student_id` (FK → `students.id`)
- `source_type` (texto): no momento usamos `'attendance'`
- `source_id` (uuid): no momento usamos o `id` do registro em `attendances`
- `xp` (int): quantidade de XP daquele evento
- `created_at`
- `unique(student_id, source_type, source_id)` (o coração da idempotência)

RLS (somente leitura):
- `super_admin` lê tudo.
- `school_admin` lê apenas eventos dos alunos da sua escola.
- usuário atleta lê apenas seus eventos.

### 2.5 `student_badges` (badges conquistadas)

Finalidade:
- Vincular atleta (`student_id`) com o badge (`badge_id`) e tier (`tier_id`) conquistados.

Campos:
- `id` (uuid PK)
- `student_id` (FK)
- `badge_id` (FK)
- `tier_id` (FK)
- `earned_at`
- `unique(student_id, badge_id, tier_id)` (evita repetir a mesma conquista)

Profundidade atual:
- Esta tabela existe e já está protegida por RLS de leitura,
- Mas **não existe função/trigger** ainda para preenchê-la automaticamente.

## 3) Banco de Dados — Funções e Trigger de XP

Tudo abaixo está no bloco “6) Funções auxiliares e trigger para XP por presença” da migração.

### 3.1 De onde vem o “+10 XP por presença”

O valor base vem de `system_settings` na chave `xp_base`.
- A migração existente do projeto já criou `system_settings` e inseriu `xp_base` (ver [create_audit_and_settings.sql](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/create_audit_and_settings.sql)).

No engine, foi criada a função:
- `public.get_xp_base()` ([09_create_gamification_engine.sql#L218-L226](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/09_create_gamification_engine.sql#L218-L226))

O detalhe importante aqui é:
- `system_settings.value` é `jsonb`. O projeto inseriu `'10'` como string, e a função faz `(value #>> '{}')::int`, que converte corretamente tanto JSONB string `"10"` quanto JSONB number `10`.

### 3.2 Curva de nível (exponencial)

Foi criada a função:
- `public.level_for_xp(total_xp integer)` ([09_create_gamification_engine.sql#L228-L247](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/09_create_gamification_engine.sql#L228-L247))

Como ela calcula:
- Começa com `lvl = 1`
- “Custo do próximo nível” começa em `100`
- Enquanto o atleta tiver XP suficiente, ela “paga” o custo e sobe o nível
- O custo cresce multiplicando por **2.5**:
  - 100 → 250 → 625 → 1563 → ...

Isso bate com o planejamento do documento de regras:
- [3-regras-negocio-funcionais.md](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/planning/3-regras-negocio-funcionais.md#L39-L42)

### 3.3 Estado (student_progress) e atualização de nível

As funções:
- `ensure_student_progress_row(student_id)` garante que exista uma linha para o atleta.
- `apply_xp_delta(student_id, delta)`:
  - soma/subtrai XP com proteção para não ficar negativo (`greatest(0, ...)`)
  - recalcula o nível usando `level_for_xp`

Tudo isso está em:
- [09_create_gamification_engine.sql#L248-L288](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/09_create_gamification_engine.sql#L248-L288)

### 3.4 Trigger: XP por presença (INSERT/UPDATE em attendances)

O trigger:
- `attendances_apply_xp` (AFTER INSERT OR UPDATE ON `public.attendances`)
- chama a função `public.handle_attendance_xp()`:
  - [09_create_gamification_engine.sql#L289-L357](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/09_create_gamification_engine.sql#L289-L357)

Regras exatas implementadas:
- **INSERT**:
  - se `new.status = 'present'`:
    1) insere `student_xp_events` com `(student_id, 'attendance', new.id, base_xp)`
    2) só aplica XP no progresso se o insert do evento realmente aconteceu (`if found then ...`)
- **UPDATE**:
  - só faz algo se houve mudança de status (`old.status is distinct from new.status`)
  - se mudou de “não presente” → “presente”: cria evento e aplica XP
  - se mudou de “presente” → “não presente”:
    - encontra o XP que tinha sido dado para aquele `attendance`
    - remove o evento
    - subtrai o XP do progresso

Por que isso é bom:
- **Idempotência**: o mesmo attendance não dá XP duas vezes (unique + “found”).
- **Reversibilidade**: se um admin mudar o status para “absent/late/excused”, o XP é removido.

Limitação real:
- Não existe handler para **DELETE** em `attendances`. Se alguém deletar uma presença, hoje o XP do evento não é removido automaticamente. Isso é uma melhoria clara para o próximo passo.

## 4) O quanto badges estão “profundos” hoje

Status atual (fiel ao código):
- Existe catálogo (`badges`) e catálogo de tiers (`tiers`)
- Existe tabela de conquistas (`student_badges`)
- Existem políticas de RLS para leitura (super admin / school admin / usuário dono)

O que **não** existe ainda:
- Não há “motor de regras” para badges (ex.: “5 presenças = badge assiduidade tier bronze”).
- Não há seeds de badges (os badges não aparecem sozinhos, alguém teria que criar).
- Não há UI de badges nem feed/notificação.

Ou seja:
- A parte “infra de dados e segurança” está pronta.
- A parte “inteligência de desbloqueio e UX” ainda não foi implementada.

## 5) UI — como o app usa a engine hoje

### 5.1 Check-in: mostrar XP, nível e “level up”

Arquivo: [CheckInPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/attendance/pages/CheckInPage.tsx)

O que acontece:
1) O usuário escaneia ou cola o QR/link, e o app faz `upsert` em `attendances` com `status: 'present'`.
2) O banco dispara o trigger e atualiza `student_progress` e `student_xp_events`.
3) O app consulta `student_progress` novamente e exibe:
   - “Nível X • Y XP”
   - “+{xp_base} XP” (lido de `system_settings`)
4) Se o nível aumentou em relação ao que estava cacheado no início da tela, aparece um aviso “Level up!” por ~2.5s.

Trechos relevantes:
- Leitura do `xp_base`: [CheckInPage.tsx#L133-L150](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/attendance/pages/CheckInPage.tsx#L133-L150)
- Leitura do progresso inicial: [CheckInPage.tsx#L152-L191](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/attendance/pages/CheckInPage.tsx#L152-L191)
- Reconsulta após check-in (para pegar o XP/nível atualizado): [CheckInPage.tsx#L343-L362](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/attendance/pages/CheckInPage.tsx#L343-L362)

### 5.2 Meu Perfil: “FUT Card” (foto, nível, XP, barra)

Arquivo: [MeuPerfilPage.tsx](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/apps/web/src/features/profile/pages/MeuPerfilPage.tsx)

Como ele busca dados:
- Busca atletas do usuário (`students` filtrando por `user_id`)
- Busca progresso de todos esses atletas em `student_progress` usando `in(...)`
- Monta cards calculando:
  - `level` (pega `student_progress.level` e confere com um cálculo local para evitar inconsistência)
  - `xpIntoLevel` e `xpForNext` com a função `getLevelInfo` (mesma curva 2.5x)
  - `%` para a barra de progressão

Observação:
- A curva usada no frontend é consistente com o banco (100, 250, 625...). Ela existe duplicada: banco e frontend.
  - Isso é aceitável no MVP, mas uma evolução é expor uma view/função no banco para retornar `xp_into_level` e `xp_for_next` para evitar duplicação.

## 6) Segurança, RLS e consistência

Pontos relevantes do que já está garantido:
- Usuário atleta só consegue **ler** seu progresso/eventos/badges por vínculo `students.user_id = auth.uid()`.
- School admin só lê dados relacionados à própria escola.
- O XP é calculado no banco (mais difícil de fraudar via frontend).

Pontos que merecem atenção:
- As funções do trigger são `security definer` (rodam com privilégios do dono). Isso é bom para permitir escrita mesmo com RLS restritiva.
- A migração não define explicitamente `REVOKE/GRANT` de execução; isso depende do padrão do Supabase (normalmente roles autenticadas conseguem executar funções `security definer` apenas se forem chamadas indiretamente pelo trigger; o trigger executa como owner, então ok).

## 7) Melhorias recomendadas (alto impacto)

### 7.1 Completar o ciclo do XP (DELETE)

Problema atual:
- Se uma linha de `attendances` for deletada, o `student_xp_events` e o `student_progress` ficam “com XP a mais”.

Melhoria:
- Adicionar `AFTER DELETE` trigger para:
  - achar o evento `'attendance'`/`old.id`
  - remover evento
  - subtrair XP

### 7.2 Motor de badges de verdade (regra → conquista)

Hoje o sistema tem “infra”, mas não tem regras.

Possíveis caminhos (do mais simples ao mais robusto):
- A) **Regras hardcoded por trigger** (rápido para MVP, ruim de manter a longo prazo)
- B) **Tabela de regras + job/trigger** (recomendado para crescer)
  - Ex.: `badge_rules` com tipo (`attendance_count`, `streak_days`, etc.) e thresholds por tier
  - Um worker (edge function / cron) recalcula periodicamente, ou trigger incremental

### 7.3 Unificar “curva de nível” (fonte única)

Hoje:
- Banco calcula o nível final.
- Frontend calcula “xp dentro do nível” e “xp pro próximo”.

Melhoria:
- Criar uma view ou função SQL que devolva `{level, xp_total, xp_into_level, xp_for_next}` por student, e o frontend só renderiza.

### 7.4 Level up com animação “de verdade”

Hoje o aviso é um card com `animate-pulse`.

Melhoria:
- Usar `framer-motion` (já existe no repo) para um modal/toast mais marcante.

### 7.5 UX do check-in: mostrar “o que aconteceu”

Hoje mostra: nível/XP e +XP base.

Melhoria:
- Mostrar também: “Presença confirmada no treino X (data/hora)”
- Mostrar badge quando existir (ex.: “Rato de treino Bronze desbloqueado!”)

## 8) Checklist para você validar se está “na profundidade que você quer”

Se você quer uma engine “profunda”, o critério é:
- O XP ser **consistente, idempotente e auditável** (já está muito bem encaminhado).
- Badges existirem como:
  - catálogo + tiers (ok)
  - **regras automatizadas** (ainda não)
  - UI/feedback e histórico (ainda não)
- A curva ser ajustável (hoje está fixa em 2.5x; XP base é ajustável via settings).

Se você me disser “quero que badges sejam 50x5 com regras configuráveis e ranking”, o próximo passo natural é implementar `badge_rules` + `student_badges` automático + uma tela de badges no perfil.

