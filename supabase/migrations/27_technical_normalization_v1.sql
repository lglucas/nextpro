insert into public.system_settings (key, value, description, updated_at, updated_by)
values (
  'technical_weights_v1',
  '{
    "sources": { "technical_daily": 0.3, "technical_monthly": 1.0 },
    "roles": { "coach": 1.0, "school_admin": 1.0, "super_admin": 1.0, "partner": 0.0, "user": 1.0 }
  }'::jsonb,
  'Pesos da engine técnica (MVP) por fonte e por papel.',
  timezone('utc'::text, now()),
  null
)
on conflict (key) do update set
  value = excluded.value,
  description = excluded.description,
  updated_at = excluded.updated_at,
  updated_by = excluded.updated_by;

create or replace function public.can_access_class(target_class_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes c
    join public.profiles p on p.id = auth.uid()
    where c.id = target_class_id
      and (
        p.role = 'super_admin'
        or (p.role = 'school_admin' and p.school_id = c.school_id)
        or (p.role = 'coach' and p.school_id = c.school_id)
      )
  );
$$;

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
begin
  if not public.can_access_class(target_class_id) then
    raise exception 'access denied';
  end if;

  return query
  with ev as (
    select
      e.student_id,
      e.event_key,
      (e.value::numeric) as value,
      coalesce(q.pillar, 'tecnica') as pillar,
      case
        when p.role = 'partner' then 0.0
        else 1.0
      end as w
    from public.engine_events e
    left join public.technical_monthly_questions q
      on q.season_id = target_season_id
     and q.key = e.event_key
    left join public.profiles p on p.id = e.actor_id
    where e.engine = 'technical'
      and e.season_id = target_season_id
      and e.source_type = 'technical_monthly'
      and (e.meta->>'month') = target_month
      and (e.meta->>'class_id') = target_class_id::text
      and e.value is not null
      and e.event_key is not null
  ),
  stats as (
    select
      event_key,
      avg(value * w) as mean,
      stddev_samp(value * w) as sd
    from ev
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

grant execute on function public.can_access_class(uuid) to authenticated;
grant execute on function public.compute_technical_monthly_class_normalization(uuid, uuid, text) to authenticated;

