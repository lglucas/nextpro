insert into public.technical_questions (season_id, kind, slot, position, key, prompt, sort_order, active)
select
  s.id,
  v.kind::text,
  v.slot::int,
  v.position::text,
  v.key::text,
  v.prompt::text,
  v.sort_order::int,
  v.active::boolean
from public.seasons s
cross join (
  values
    ('base', 1, null, 'daily_base_tecnica_primeiro_toque', 'Primeiro toque e controle orientado (no treino)', 110, true),
    ('base', 1, null, 'daily_base_tecnica_passe_curto', 'Passe curto sob pressão (no treino)', 120, true),
    ('base', 1, null, 'daily_base_tecnica_passe_longo', 'Passe longo/virada (no treino)', 130, true),
    ('base', 1, null, 'daily_base_tatica_posicionamento_sem_bola', 'Posicionamento sem bola (linha de passe e cobertura)', 140, true),
    ('base', 1, null, 'daily_base_tatica_compactacao', 'Compactação e ocupação de espaços', 150, true),
    ('base', 1, null, 'daily_base_mental_coragem', 'Coragem para jogar e assumir responsabilidade', 160, true),
    ('base', 1, null, 'daily_base_mental_competitividade', 'Competitividade (duelos, intensidade e vontade)', 170, true),
    ('base', 1, null, 'daily_base_mental_maturidade', 'Maturidade (controle emocional e reação a adversidade)', 180, true),

    ('position', 2, 'goleiro', 'daily_goleiro_s2_queda_tecnica', 'Queda e técnica de defesas', 70, true),
    ('position', 2, 'goleiro', 'daily_goleiro_s2_soco_rebote', 'Controle de rebote e soco (decisão)', 80, true),
    ('position', 2, 'goleiro', 'daily_goleiro_s2_linha_passe', 'Linha de passe curta (apoio na saída)', 90, true),
    ('position', 2, 'goleiro', 'daily_goleiro_s2_jogo_com_pe', 'Jogo com o pé (passe/lançamento)', 100, true),

    ('position', 3, 'goleiro', 'daily_goleiro_s3_postura', 'Postura e presença (segurança e impacto no time)', 70, true),
    ('position', 3, 'goleiro', 'daily_goleiro_s3_tatica_linha', 'Entendimento tático da linha defensiva', 80, true),
    ('position', 3, 'goleiro', 'daily_goleiro_s3_transicao', 'Transição (após defesa/recuperação)', 90, true),
    ('position', 3, 'goleiro', 'daily_goleiro_s3_gestao_ritmo', 'Gestão de ritmo (quando acelerar ou segurar)', 100, true),

    ('position', 2, 'zagueiro', 'daily_zagueiro_s2_timing_bote', 'Timing do bote (sem ser batido)', 70, true),
    ('position', 2, 'zagueiro', 'daily_zagueiro_s2_protecao_area', 'Proteção de área (posicionamento e cortes)', 80, true),
    ('position', 2, 'zagueiro', 'daily_zagueiro_s2_passe_vertical', 'Passe vertical e progressão com qualidade', 90, true),
    ('position', 2, 'zagueiro', 'daily_zagueiro_s2_corpo_orientado', 'Corpo orientado (recepção para progredir)', 100, true),

    ('position', 3, 'zagueiro', 'daily_zagueiro_s3_gestao_risco', 'Gestão de risco (quando simplificar)', 70, true),
    ('position', 3, 'zagueiro', 'daily_zagueiro_s3_recomposicao', 'Recomposição (corrida e cobertura profunda)', 80, true),
    ('position', 3, 'zagueiro', 'daily_zagueiro_s3_bolas_paradas', 'Bolas paradas (marcação e posicionamento)', 90, true),
    ('position', 3, 'zagueiro', 'daily_zagueiro_s3_calma', 'Calma e controle emocional em pressão', 100, true),

    ('position', 2, 'lateral', 'daily_lateral_s2_inversao', 'Inversão/virada de jogo (passe longo)', 70, true),
    ('position', 2, 'lateral', 'daily_lateral_s2_apoio_interno', 'Apoio interno (meio-espaço)', 80, true),
    ('position', 2, 'lateral', 'daily_lateral_s2_duelos_def', 'Duelos defensivos no corredor', 90, true),
    ('position', 2, 'lateral', 'daily_lateral_s2_qualidade_cruzamento', 'Qualidade do cruzamento (zona e força)', 100, true),

    ('position', 3, 'lateral', 'daily_lateral_s3_organizacao', 'Organização defensiva e troca de marcação', 70, true),
    ('position', 3, 'lateral', 'daily_lateral_s3_pressing', 'Pressing (quando saltar e quando conter)', 80, true),
    ('position', 3, 'lateral', 'daily_lateral_s3_transicao_of', 'Transição ofensiva (acelerar com critério)', 90, true),
    ('position', 3, 'lateral', 'daily_lateral_s3_tomada', 'Tomada de decisão no corredor', 100, true),

    ('position', 2, 'volante', 'daily_volante_s2_passe_vertical', 'Passe vertical (quebrar linha)', 70, true),
    ('position', 2, 'volante', 'daily_volante_s2_giro', 'Giro e corpo orientado (receber para frente)', 80, true),
    ('position', 2, 'volante', 'daily_volante_s2_pressao_linha', 'Pressão na linha (encurtar e conter)', 90, true),
    ('position', 2, 'volante', 'daily_volante_s2_cobertura_lateral', 'Cobertura do lateral (meio-espaço)', 100, true),

    ('position', 3, 'volante', 'daily_volante_s3_leitura_pressao', 'Leitura de pressão (quando sair jogando)', 70, true),
    ('position', 3, 'volante', 'daily_volante_s3_balanco', 'Balanço defensivo (equilíbrio do time)', 80, true),
    ('position', 3, 'volante', 'daily_volante_s3_comando', 'Comando e organização do time', 90, true),
    ('position', 3, 'volante', 'daily_volante_s3_faltas_inteligentes', 'Faltas inteligentes (parar contra-ataque)', 100, true),

    ('position', 2, 'meia', 'daily_meia_s2_passe_entre_linhas', 'Passe entre linhas (quebrar bloco)', 70, true),
    ('position', 2, 'meia', 'daily_meia_s2_escaneamento', 'Escaneamento (olhar antes de receber)', 80, true),
    ('position', 2, 'meia', 'daily_meia_s2_ritmo', 'Ritmo (quando acelerar ou controlar)', 90, true),
    ('position', 2, 'meia', 'daily_meia_s2_pressao_pos_perda', 'Pressão pós-perda e reação imediata', 100, true),

    ('position', 3, 'meia', 'daily_meia_s3_compromisso_def', 'Compromisso defensivo e recomposição', 70, true),
    ('position', 3, 'meia', 'daily_meia_s3_consistencia', 'Consistência (regularidade no treino)', 80, true),
    ('position', 3, 'meia', 'daily_meia_s3_coragem', 'Coragem para assumir jogo', 90, true),
    ('position', 3, 'meia', 'daily_meia_s3_lideranca', 'Liderança e comunicação no meio', 100, true),

    ('position', 2, 'ponta', 'daily_ponta_s2_tomada_ultimo_terco', 'Tomada de decisão no último terço', 70, true),
    ('position', 2, 'ponta', 'daily_ponta_s2_apoio_interno', 'Apoio interno e combinação', 80, true),
    ('position', 2, 'ponta', 'daily_ponta_s2_cruzamento_rasteiro', 'Cruzamento rasteiro (zona e timing)', 90, true),
    ('position', 2, 'ponta', 'daily_ponta_s2_ataque_profundidade', 'Ataque à profundidade e ruptura', 100, true),

    ('position', 3, 'ponta', 'daily_ponta_s3_recomposicao', 'Recomposição e disciplina tática', 70, true),
    ('position', 3, 'ponta', 'daily_ponta_s3_pressao_gatilhos', 'Pressão por gatilhos (timing)', 80, true),
    ('position', 3, 'ponta', 'daily_ponta_s3_sem_bola_compactar', 'Movimento sem bola para compactar', 90, true),
    ('position', 3, 'ponta', 'daily_ponta_s3_mentalidade', 'Mentalidade (coragem e competitividade)', 100, true),

    ('position', 2, 'atacante', 'daily_atacante_s2_apoio_entre_zagueiros', 'Apoio entre zagueiros (posicionamento)', 70, true),
    ('position', 2, 'atacante', 'daily_atacante_s2_finalizacao_primeiro_pau', 'Finalização em 1º pau (timing)', 80, true),
    ('position', 2, 'atacante', 'daily_atacante_s2_protecao_bola', 'Proteção de bola e retenção', 90, true),
    ('position', 2, 'atacante', 'daily_atacante_s2_combinacao', 'Combinação curta (tabela e parede)', 100, true),

    ('position', 3, 'atacante', 'daily_atacante_s3_pressing_gatilhos', 'Pressing por gatilhos (forçar erro)', 70, true),
    ('position', 3, 'atacante', 'daily_atacante_s3_movimento_cego', 'Movimento cego (atacar espaço fora da bola)', 80, true),
    ('position', 3, 'atacante', 'daily_atacante_s3_mentalidade_gol', 'Mentalidade de gol (coragem e decisão)', 90, true),
    ('position', 3, 'atacante', 'daily_atacante_s3_inteligencia_area', 'Inteligência de área (tempo e posicionamento)', 100, true)
) as v(kind, slot, position, key, prompt, sort_order, active)
where s.is_active = true
on conflict (season_id, kind, slot, position, key) do nothing;

insert into public.technical_monthly_questions (season_id, kind, position, key, prompt, sort_order, active)
select
  s.id,
  v.kind::text,
  v.position::text,
  v.key::text,
  v.prompt::text,
  v.sort_order::int,
  v.active::boolean
from public.seasons s
cross join (
  values
    ('base', null, 'monthly_base_profissionalismo', 'Profissionalismo (rotina e compromisso)', 1000, false),
    ('base', null, 'monthly_base_assiduidade', 'Assiduidade e pontualidade', 1010, false),
    ('base', null, 'monthly_base_cuidado_corpo', 'Cuidado com o corpo (sono, alimentação, prevenção)', 1020, false),
    ('base', null, 'monthly_base_disciplina_tatica', 'Disciplina tática e aderência ao modelo', 1030, false),
    ('base', null, 'monthly_base_pressing', 'Pressing e gatilhos defensivos', 1040, false),
    ('base', null, 'monthly_base_transicao', 'Transição (ganha/perde) e reação', 1050, false),
    ('base', null, 'monthly_base_jogo_sem_bola', 'Jogo sem bola (apoio, ruptura e linhas de passe)', 1060, false),
    ('base', null, 'monthly_base_competitividade', 'Competitividade e mentalidade', 1070, false),
    ('base', null, 'monthly_base_autoconfianca', 'Autoconfiança e coragem para assumir jogo', 1080, false),
    ('base', null, 'monthly_base_controle_emocional', 'Controle emocional em pressão', 1090, false),
    ('base', null, 'monthly_base_lideranca', 'Liderança e comunicação no grupo', 1100, false),
    ('base', null, 'monthly_base_aprendizado', 'Capacidade de aprender e evoluir', 1110, false),

    ('position', 'goleiro', 'monthly_goleiro_postura', 'Postura e presença (segurança)', 1000, false),
    ('position', 'goleiro', 'monthly_goleiro_rebote', 'Controle de rebotes', 1010, false),
    ('position', 'goleiro', 'monthly_goleiro_jogo_pe', 'Jogo com o pé (passe/lançamento)', 1020, false),
    ('position', 'goleiro', 'monthly_goleiro_calma', 'Calma e controle emocional', 1030, false),
    ('position', 'goleiro', 'monthly_goleiro_transicao', 'Transição (acelerar ou controlar)', 1040, false),
    ('position', 'goleiro', 'monthly_goleiro_bolas_paradas', 'Bolas paradas (posicionamento e decisão)', 1050, false),
    ('position', 'goleiro', 'monthly_goleiro_linha', 'Entendimento da linha defensiva', 1060, false),
    ('position', 'goleiro', 'monthly_goleiro_gestao_risco', 'Gestão de risco (decisão de saída)', 1070, false),

    ('position', 'zagueiro', 'monthly_zagueiro_protecao_area', 'Proteção de área (posicionamento e cortes)', 1000, false),
    ('position', 'zagueiro', 'monthly_zagueiro_passe_vertical', 'Passe vertical e progressão', 1010, false),
    ('position', 'zagueiro', 'monthly_zagueiro_corpo_orientado', 'Corpo orientado (receber para progredir)', 1020, false),
    ('position', 'zagueiro', 'monthly_zagueiro_bolas_paradas', 'Bolas paradas (marcação e posicionamento)', 1030, false),
    ('position', 'zagueiro', 'monthly_zagueiro_recomposicao', 'Recomposição e cobertura profunda', 1040, false),
    ('position', 'zagueiro', 'monthly_zagueiro_gestao_risco', 'Gestão de risco (simplificar quando precisa)', 1050, false),
    ('position', 'zagueiro', 'monthly_zagueiro_calma', 'Calma sob pressão', 1060, false),
    ('position', 'zagueiro', 'monthly_zagueiro_pressing', 'Pressing e encurtar linhas', 1070, false),

    ('position', 'lateral', 'monthly_lateral_inversao', 'Inversão/virada de jogo', 1000, false),
    ('position', 'lateral', 'monthly_lateral_apoio_interno', 'Apoio interno (meio-espaço)', 1010, false),
    ('position', 'lateral', 'monthly_lateral_pressing', 'Pressing no corredor (timing)', 1020, false),
    ('position', 'lateral', 'monthly_lateral_transicao_of', 'Transição ofensiva com critério', 1030, false),
    ('position', 'lateral', 'monthly_lateral_organizacao', 'Organização e troca de marcação', 1040, false),
    ('position', 'lateral', 'monthly_lateral_duelos_def', 'Duelos defensivos', 1050, false),
    ('position', 'lateral', 'monthly_lateral_gestao_ritmo', 'Gestão de ritmo (subir/segurar)', 1060, false),
    ('position', 'lateral', 'monthly_lateral_tomada', 'Tomada de decisão no corredor', 1070, false),

    ('position', 'volante', 'monthly_volante_passe_vertical', 'Passe vertical (quebrar linha)', 1000, false),
    ('position', 'volante', 'monthly_volante_giro', 'Giro e corpo orientado', 1010, false),
    ('position', 'volante', 'monthly_volante_balanco', 'Balanço defensivo (equilíbrio do time)', 1020, false),
    ('position', 'volante', 'monthly_volante_pressao_linha', 'Pressão na linha (encurtar e conter)', 1030, false),
    ('position', 'volante', 'monthly_volante_cobertura_lateral', 'Cobertura do lateral', 1040, false),
    ('position', 'volante', 'monthly_volante_faltas', 'Faltas inteligentes (parar transição)', 1050, false),
    ('position', 'volante', 'monthly_volante_comando', 'Comando e organização do time', 1060, false),
    ('position', 'volante', 'monthly_volante_gestao_risco', 'Gestão de risco na saída', 1070, false),

    ('position', 'meia', 'monthly_meia_passe_entre_linhas', 'Passe entre linhas', 1000, false),
    ('position', 'meia', 'monthly_meia_escaneamento', 'Escaneamento (olhar antes de receber)', 1010, false),
    ('position', 'meia', 'monthly_meia_ritmo', 'Gestão de ritmo (acelerar/pausar)', 1020, false),
    ('position', 'meia', 'monthly_meia_pressao_pos_perda', 'Pressão pós-perda', 1030, false),
    ('position', 'meia', 'monthly_meia_compromisso_def', 'Compromisso defensivo', 1040, false),
    ('position', 'meia', 'monthly_meia_coragem', 'Coragem para assumir jogo', 1050, false),
    ('position', 'meia', 'monthly_meia_lideranca', 'Liderança e comunicação', 1060, false),
    ('position', 'meia', 'monthly_meia_constancia', 'Constância e controle emocional', 1070, false),

    ('position', 'ponta', 'monthly_ponta_tomada_ultimo_terco', 'Tomada de decisão no último terço', 1000, false),
    ('position', 'ponta', 'monthly_ponta_apoio_interno', 'Apoio interno e combinação', 1010, false),
    ('position', 'ponta', 'monthly_ponta_cruzamento_rasteiro', 'Cruzamento rasteiro (zona e timing)', 1020, false),
    ('position', 'ponta', 'monthly_ponta_ataque_profundidade', 'Ataque à profundidade', 1030, false),
    ('position', 'ponta', 'monthly_ponta_recomposicao', 'Recomposição e disciplina tática', 1040, false),
    ('position', 'ponta', 'monthly_ponta_pressao_gatilhos', 'Pressão por gatilhos', 1050, false),
    ('position', 'ponta', 'monthly_ponta_sem_bola_compactar', 'Movimento sem bola para compactar', 1060, false),
    ('position', 'ponta', 'monthly_ponta_mentalidade', 'Mentalidade (coragem e competitividade)', 1070, false),

    ('position', 'atacante', 'monthly_atacante_apoio_entre_zagueiros', 'Apoio entre zagueiros (posicionamento)', 1000, false),
    ('position', 'atacante', 'monthly_atacante_primeiro_pau', 'Finalização em 1º pau (timing)', 1010, false),
    ('position', 'atacante', 'monthly_atacante_protecao_bola', 'Proteção de bola e retenção', 1020, false),
    ('position', 'atacante', 'monthly_atacante_combinacao', 'Combinação curta (tabela e parede)', 1030, false),
    ('position', 'atacante', 'monthly_atacante_pressing_gatilhos', 'Pressing por gatilhos', 1040, false),
    ('position', 'atacante', 'monthly_atacante_movimento_cego', 'Movimento cego (atacar espaço fora da bola)', 1050, false),
    ('position', 'atacante', 'monthly_atacante_mentalidade_gol', 'Mentalidade de gol (coragem e decisão)', 1060, false),
    ('position', 'atacante', 'monthly_atacante_inteligencia_area', 'Inteligência de área (tempo e posicionamento)', 1070, false)
) as v(kind, position, key, prompt, sort_order, active)
where s.is_active = true
on conflict (season_id, kind, position, key) do nothing;

