alter table public.technical_questions
add column if not exists pillar text;

update public.technical_questions
set pillar = coalesce(pillar, 'tecnica');

alter table public.technical_questions
alter column pillar set default 'tecnica';

alter table public.technical_questions
alter column pillar set not null;

alter table public.technical_questions
drop constraint if exists technical_questions_pillar_check;

alter table public.technical_questions
add constraint technical_questions_pillar_check
check (pillar in ('tecnica', 'tatica', 'mental', 'fisico'));

update public.technical_questions
set pillar = case
  when prompt ilike '%tática%' or prompt ilike '%tatica%' or prompt ilike '%posicion%' or prompt ilike '%compact%' or prompt ilike '%press%' or prompt ilike '%transi%' or prompt ilike '%linha%' or prompt ilike '%cobertura%' or prompt ilike '%balanço%' or prompt ilike '%balanco%' or prompt ilike '%organiza%' or prompt ilike '%gatilho%' or prompt ilike '%recompos%' or prompt ilike '%marcação%' or prompt ilike '%marcacao%' or prompt ilike '%leitura%' or prompt ilike '%gestão%' or prompt ilike '%gestao%' or prompt ilike '%ritmo%'
    then 'tatica'
  when prompt ilike '%mental%' or prompt ilike '%emocional%' or prompt ilike '%coragem%' or prompt ilike '%confiança%' or prompt ilike '%confianca%' or prompt ilike '%maturidade%' or prompt ilike '%competitiv%' or prompt ilike '%liderança%' or prompt ilike '%lideranca%' or prompt ilike '%comunica%' or prompt ilike '%profissional%' or prompt ilike '%disciplina%' or prompt ilike '%assiduidade%' or prompt ilike '%pontual%' or prompt ilike '%compromiss%' or prompt ilike '%aprend%' or prompt ilike '%constân%' or prompt ilike '%constan%' or prompt ilike '%regular%' or prompt ilike '%calma%'
    then 'mental'
  when prompt ilike '%veloc%' or prompt ilike '%acelera%' or prompt ilike '%força%' or prompt ilike '%forca%' or prompt ilike '%resist%' or prompt ilike '%explos%' or prompt ilike '%agilid%' or prompt ilike '%sprint%'
    then 'fisico'
  else 'tecnica'
end;

create index if not exists technical_questions_season_pillar_idx
on public.technical_questions (season_id, pillar);

