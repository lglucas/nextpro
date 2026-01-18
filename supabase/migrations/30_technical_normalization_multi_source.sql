create table if not exists public.technical_evaluator_reputation (
  actor_id uuid primary key references public.profiles (id) on delete cascade,
  weight numeric not null default 1,
  shadow_banned boolean not null default false,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.technical_evaluator_reputation enable row level security;

drop policy if exists "super_admin_manage_technical_evaluator_reputation" on public.technical_evaluator_reputation;
create policy "super_admin_manage_technical_evaluator_reputation"
on public.technical_evaluator_reputation
for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));

create or replace function public.compute_technical_monthly_class_normalization(
  target_season_id uuid,
  target_class_id uuid,
  target_month text
)
returns table (
  student_id uuid,
  avg_raw numeric,
  avg_norm numeric,
  pillars jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  weights jsonb;
  start_date date;
  end_date date;
begin
  if not public.can_access_class(target_class_id) then
    raise exception 'access denied';
  end if;

  start_date := to_date(target_month || '-01', 'YYYY-MM-DD');
  end_date := (start_date + interval '1 month')::date;

  select s.value into weights
  from public.system_settings s
  where s.key = 'technical_weights_v1'
  limit 1;

  return query
  with cfg as (
    select
      coalesce(weights, '{}'::jsonb) as w,
      coalesce((weights->'sources'->>'technical_monthly')::numeric, 1.0) as w_monthly,
      coalesce((weights->'sources'->>'technical_daily')::numeric, 0.3) as w_daily
  ),
  ev as (
    select
      e.student_id,
      e.event_key,
      (e.value::numeric) as value,
      coalesce(
        (e.meta->>'pillar'),
        qm.pillar,
        qd.pillar,
        'tecnica'
      ) as pillar,
      (
        case
          when e.source_type = 'technical_monthly' then cfg.w_monthly
          when e.source_type = 'technical_daily' then cfg.w_daily
          else 0
        end
        *
        coalesce((cfg.w->'roles'->>coalesce(p.role, 'user'))::numeric, 1.0)
        *
        case
          when rep.shadow_banned then 0
          else coalesce(rep.weight, 1)
        end
      ) as w
    from public.engine_events e
    cross join cfg
    left join public.profiles p on p.id = e.actor_id
    left join public.technical_evaluator_reputation rep on rep.actor_id = e.actor_id
    left join public.technical_monthly_questions qm
      on qm.season_id = target_season_id
     and qm.key = e.event_key
    left join public.technical_questions qd
      on qd.season_id = target_season_id
     and qd.key = e.event_key
    left join public.class_sessions cs
      on cs.id = nullif(e.meta->>'session_id', '')::uuid
    where e.engine = 'technical'
      and e.season_id = target_season_id
      and (e.meta->>'class_id') = target_class_id::text
      and e.value is not null
      and e.event_key is not null
      and (
        (e.source_type = 'technical_monthly' and (e.meta->>'month') = target_month)
        or
        (
          e.source_type = 'technical_daily'
          and coalesce(cs.date::date, e.created_at::date) >= start_date
          and coalesce(cs.date::date, e.created_at::date) < end_date
        )
      )
  ),
  stats as (
    select
      event_key,
      avg(value * w) as mean,
      stddev_samp(value * w) as sd
    from ev
    where w > 0
    group by event_key
  ),
  scored as (
    select
      ev.student_id,
      ev.pillar,
      (ev.value * ev.w) as raw,
      case
        when stats.sd is null or stats.sd = 0 then 5
        else greatest(0, least(10, 5 + 2 * ((ev.value * ev.w) - stats.mean) / stats.sd))
      end as norm
    from ev
    join stats using (event_key)
    where ev.w > 0
  )
  select
    student_id,
    avg(raw) as avg_raw,
    avg(norm) as avg_norm,
    jsonb_build_object(
      'tecnica', avg(norm) filter (where pillar = 'tecnica'),
      'tatica', avg(norm) filter (where pillar = 'tatica'),
      'mental', avg(norm) filter (where pillar = 'mental'),
      'fisico', avg(norm) filter (where pillar = 'fisico')
    ) as pillars
  from scored
  group by student_id;
end;
$$;

grant execute on function public.compute_technical_monthly_class_normalization(uuid, uuid, text) to authenticated;

