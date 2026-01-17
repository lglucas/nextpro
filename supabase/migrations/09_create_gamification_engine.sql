-- ==========================================
-- FEATURE: GAMIFICAÇÃO (ENGINE)
-- Data: 2026-01-10
-- Descrição: Estrutura de XP/níveis + badges/tiers e trigger de XP por presença
-- ==========================================

-- 1) Tiers (horizontais) para badges
create table if not exists public.tiers (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  name text not null,
  rank integer not null check (rank >= 1),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tiers enable row level security;

drop policy if exists "Todos podem ler tiers" on public.tiers;
create policy "Todos podem ler tiers"
  on public.tiers for select
  using (auth.role() = 'authenticated');

drop policy if exists "Super Admin gerencia tiers" on public.tiers;
create policy "Super Admin gerencia tiers"
  on public.tiers for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

insert into public.tiers (key, name, rank)
values
  ('bronze', 'Bronze', 1),
  ('prata', 'Prata', 2),
  ('ouro', 'Ouro', 3),
  ('platina', 'Platina', 4),
  ('diamante', 'Diamante', 5)
on conflict (key) do nothing;

-- 2) Badges (verticais)
create table if not exists public.badges (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  name text not null,
  description text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.badges enable row level security;

drop policy if exists "Todos podem ler badges" on public.badges;
create policy "Todos podem ler badges"
  on public.badges for select
  using (auth.role() = 'authenticated');

drop policy if exists "Super Admin gerencia badges" on public.badges;
create policy "Super Admin gerencia badges"
  on public.badges for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

-- 3) Progresso do atleta (XP e nível)
create table if not exists public.student_progress (
  student_id uuid primary key references public.students(id) on delete cascade,
  xp_total integer not null default 0 check (xp_total >= 0),
  level integer not null default 1 check (level >= 1),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.student_progress enable row level security;

drop policy if exists "Super Admin vê progresso de todos" on public.student_progress;
create policy "Super Admin vê progresso de todos"
  on public.student_progress for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "School Admin vê progresso da escola" on public.student_progress;
create policy "School Admin vê progresso da escola"
  on public.student_progress for select
  using (
    exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = student_progress.student_id
      and p.role = 'school_admin'
      and p.school_id = s.school_id
    )
  );

drop policy if exists "Usuário vê próprio progresso" on public.student_progress;
create policy "Usuário vê próprio progresso"
  on public.student_progress for select
  using (
    exists (
      select 1
      from public.students s
      where s.id = student_progress.student_id
      and s.user_id = auth.uid()
    )
  );

-- 4) Eventos de XP (auditoria/idempotência por source)
create table if not exists public.student_xp_events (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.students(id) on delete cascade not null,
  source_type text not null,
  source_id uuid not null,
  xp integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, source_type, source_id)
);

alter table public.student_xp_events enable row level security;

drop policy if exists "Super Admin vê eventos de XP" on public.student_xp_events;
create policy "Super Admin vê eventos de XP"
  on public.student_xp_events for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "School Admin vê eventos de XP da escola" on public.student_xp_events;
create policy "School Admin vê eventos de XP da escola"
  on public.student_xp_events for select
  using (
    exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = student_xp_events.student_id
      and p.role = 'school_admin'
      and p.school_id = s.school_id
    )
  );

drop policy if exists "Usuário vê próprios eventos de XP" on public.student_xp_events;
create policy "Usuário vê próprios eventos de XP"
  on public.student_xp_events for select
  using (
    exists (
      select 1
      from public.students s
      where s.id = student_xp_events.student_id
      and s.user_id = auth.uid()
    )
  );

-- 5) Badges conquistadas (estrutura mínima para uso futuro)
create table if not exists public.student_badges (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.students(id) on delete cascade not null,
  badge_id uuid references public.badges(id) on delete cascade not null,
  tier_id uuid references public.tiers(id) on delete restrict not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, badge_id, tier_id)
);

alter table public.student_badges enable row level security;

drop policy if exists "Super Admin vê badges conquistadas" on public.student_badges;
create policy "Super Admin vê badges conquistadas"
  on public.student_badges for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "School Admin vê badges conquistadas da escola" on public.student_badges;
create policy "School Admin vê badges conquistadas da escola"
  on public.student_badges for select
  using (
    exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = student_badges.student_id
      and p.role = 'school_admin'
      and p.school_id = s.school_id
    )
  );

drop policy if exists "Usuário vê próprios badges conquistadas" on public.student_badges;
create policy "Usuário vê próprios badges conquistadas"
  on public.student_badges for select
  using (
    exists (
      select 1
      from public.students s
      where s.id = student_badges.student_id
      and s.user_id = auth.uid()
    )
  );

-- 6) Funções auxiliares e trigger para XP por presença
create or replace function public.get_xp_base()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select (value #>> '{}')::int from public.system_settings where key = 'xp_base'), 10);
$$;

create or replace function public.level_for_xp(total_xp integer)
returns integer
language plpgsql
immutable
as $$
declare
  lvl integer := 1;
  next_cost integer := 100;
  remaining integer := greatest(total_xp, 0);
begin
  while remaining >= next_cost loop
    remaining := remaining - next_cost;
    lvl := lvl + 1;
    next_cost := greatest(1, ceil(next_cost * 2.5)::int);
  end loop;

  return lvl;
end;
$$;

create or replace function public.ensure_student_progress_row(p_student_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.student_progress (student_id)
  values (p_student_id)
  on conflict (student_id) do nothing;
end;
$$;

create or replace function public.apply_xp_delta(p_student_id uuid, p_delta integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  next_total integer;
  next_level integer;
begin
  perform public.ensure_student_progress_row(p_student_id);

  update public.student_progress
  set xp_total = greatest(0, xp_total + p_delta),
      updated_at = timezone('utc'::text, now())
  where student_id = p_student_id
  returning xp_total into next_total;

  next_level := public.level_for_xp(coalesce(next_total, 0));

  update public.student_progress
  set level = next_level,
      updated_at = timezone('utc'::text, now())
  where student_id = p_student_id
    and level <> next_level;
end;
$$;

create or replace function public.handle_attendance_xp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_xp integer;
  existing_xp integer;
begin
  base_xp := public.get_xp_base();

  if tg_op = 'INSERT' then
    if new.status = 'present' then
      perform public.ensure_student_progress_row(new.student_id);

      insert into public.student_xp_events (student_id, source_type, source_id, xp)
      values (new.student_id, 'attendance', new.id, base_xp)
      on conflict (student_id, source_type, source_id) do nothing;

      if found then
        perform public.apply_xp_delta(new.student_id, base_xp);
      end if;
    end if;

    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.status is distinct from new.status then
      if old.status <> 'present' and new.status = 'present' then
        perform public.ensure_student_progress_row(new.student_id);

        insert into public.student_xp_events (student_id, source_type, source_id, xp)
        values (new.student_id, 'attendance', new.id, base_xp)
        on conflict (student_id, source_type, source_id) do nothing;

        if found then
          perform public.apply_xp_delta(new.student_id, base_xp);
        end if;
      elsif old.status = 'present' and new.status <> 'present' then
        select xp into existing_xp
        from public.student_xp_events
        where student_id = old.student_id
          and source_type = 'attendance'
          and source_id = old.id;

        if existing_xp is not null then
          delete from public.student_xp_events
          where student_id = old.student_id
            and source_type = 'attendance'
            and source_id = old.id;

          perform public.apply_xp_delta(old.student_id, -existing_xp);
        end if;
      end if;
    end if;

    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists attendances_apply_xp on public.attendances;
create trigger attendances_apply_xp
  after insert or update on public.attendances
  for each row execute procedure public.handle_attendance_xp();

