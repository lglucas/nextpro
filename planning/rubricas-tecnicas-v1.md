# Rubricas Técnicas — V1 (Seeds)

Este documento descreve as rubricas técnicas semeadas no Supabase para a temporada ativa.

## 1) Avaliação diária (pós‑treino)
Tabela: `technical_questions`

Formato:
- `kind = base` e `slot = 1`: perguntas base (sempre).
- `kind = position` e `slot = 2/3`: perguntas por posição (sempre).

### Slot 1 (Base)
- `daily_base_intensidade` — Intensidade e energia no treino
- `daily_base_atencao` — Atenção e concentração
- `daily_base_esforco_defensivo` — Esforço defensivo (sem bola)
- `daily_base_tomada_decisao` — Tomada de decisão
- `daily_base_execucao_fundamentos` — Execução dos fundamentos
- `daily_base_comunicacao` — Comunicação e liderança
- `daily_base_disciplina_tatica` — Disciplina tática (entender e cumprir função)
- `daily_base_resiliencia` — Resiliência após erro

### Slot 2/3 (Por posição)
**Goleiro**
- Slot 2:
  - `daily_goleiro_s2_reposicao`
  - `daily_goleiro_s2_reflexo`
  - `daily_goleiro_s2_jogo_aereo`
  - `daily_goleiro_s2_posicionamento`
  - `daily_goleiro_s2_1x1`
  - `daily_goleiro_s2_bola_com_pes`
- Slot 3:
  - `daily_goleiro_s3_comando_area`
  - `daily_goleiro_s3_decisao_saida`
  - `daily_goleiro_s3_organizacao_defesa`
  - `daily_goleiro_s3_recuperacao_erro`
  - `daily_goleiro_s3_leitura_jogo`
  - `daily_goleiro_s3_coragem`

**Zagueiro**
- Slot 2:
  - `daily_zagueiro_s2_marcacao_1x1`
  - `daily_zagueiro_s2_jogo_aereo`
  - `daily_zagueiro_s2_cobertura`
  - `daily_zagueiro_s2_saida_bola`
  - `daily_zagueiro_s2_antecipacao`
  - `daily_zagueiro_s2_controle_pressao`
- Slot 3:
  - `daily_zagueiro_s3_linha_defensiva`
  - `daily_zagueiro_s3_comunicacao`
  - `daily_zagueiro_s3_transicao_def`
  - `daily_zagueiro_s3_temperamento`
  - `daily_zagueiro_s3_faltas`
  - `daily_zagueiro_s3_duelos`

**Lateral**
- Slot 2:
  - `daily_lateral_s2_apoio`
  - `daily_lateral_s2_cruzamento`
  - `daily_lateral_s2_1x1_def`
  - `daily_lateral_s2_transicao`
  - `daily_lateral_s2_dominio_passe`
  - `daily_lateral_s2_pressao`
- Slot 3:
  - `daily_lateral_s3_tatica`
  - `daily_lateral_s3_cobertura`
  - `daily_lateral_s3_leitura`
  - `daily_lateral_s3_intensidade`
  - `daily_lateral_s3_concentracao`
  - `daily_lateral_s3_duelos`

**Volante**
- Slot 2:
  - `daily_volante_s2_saida_bola`
  - `daily_volante_s2_protecao`
  - `daily_volante_s2_desarme`
  - `daily_volante_s2_marcar_linhas`
  - `daily_volante_s2_cobertura`
  - `daily_volante_s2_pressao`
- Slot 3:
  - `daily_volante_s3_posicionamento`
  - `daily_volante_s3_organizacao`
  - `daily_volante_s3_tomada`
  - `daily_volante_s3_transicao`
  - `daily_volante_s3_comunicacao`
  - `daily_volante_s3_duelos`

**Meia**
- Slot 2:
  - `daily_meia_s2_criacao`
  - `daily_meia_s2_controle_orientado`
  - `daily_meia_s2_passe_curto`
  - `daily_meia_s2_chute`
  - `daily_meia_s2_drible`
  - `daily_meia_s2_entre_linhas`
- Slot 3:
  - `daily_meia_s3_decisao`
  - `daily_meia_s3_pressao`
  - `daily_meia_s3_compactacao`
  - `daily_meia_s3_temperamento`
  - `daily_meia_s3_comunicacao`
  - `daily_meia_s3_leitura`

**Ponta**
- Slot 2:
  - `daily_ponta_s2_1x1`
  - `daily_ponta_s2_finalizacao`
  - `daily_ponta_s2_cruzamento`
  - `daily_ponta_s2_velocidade`
  - `daily_ponta_s2_movimento`
  - `daily_ponta_s2_dominio`
- Slot 3:
  - `daily_ponta_s3_pressao`
  - `daily_ponta_s3_decisao`
  - `daily_ponta_s3_sem_bola`
  - `daily_ponta_s3_concentracao`
  - `daily_ponta_s3_duelos`
  - `daily_ponta_s3_coragem`

**Atacante**
- Slot 2:
  - `daily_atacante_s2_finalizacao`
  - `daily_atacante_s2_movimento`
  - `daily_atacante_s2_apoio`
  - `daily_atacante_s2_1x1`
  - `daily_atacante_s2_profundidade`
  - `daily_atacante_s2_pressao`
- Slot 3:
  - `daily_atacante_s3_decisao`
  - `daily_atacante_s3_movimento_sem_bola`
  - `daily_atacante_s3_compromisso`
  - `daily_atacante_s3_coragem`
  - `daily_atacante_s3_temperamento`
  - `daily_atacante_s3_duelos`

## 2) Avaliação mensal
Tabela: `technical_monthly_questions`

Formato:
- `kind = base`: perguntas base (comuns).
- `kind = position`: perguntas específicas por posição.

### Base (24 itens)
Prefixo: `monthly_base_`

### Por posição (12 itens por posição)
Prefixos:
- `monthly_goleiro_`
- `monthly_zagueiro_`
- `monthly_lateral_`
- `monthly_volante_`
- `monthly_meia_`
- `monthly_ponta_`
- `monthly_atacante_`

Fonte de seed: [24_seed_technical_rubrics_v1.sql](file:///c:/Users/lucas/OneDrive/Documentos/Lucas/SuperAppFutebol/supabase/migrations/24_seed_technical_rubrics_v1.sql)

