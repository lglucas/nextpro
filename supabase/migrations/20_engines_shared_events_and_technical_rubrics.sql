create table if not exists public.engine_events (
  id uuid default gen_random_uuid() primary key,
  engine text not null check (engine in ('technical', 'social', 'benefits')),
  season_id uuid references public.seasons(id) on delete restrict not null,
  student_id uuid references public.students(id) on delete cascade not null,
  actor_id uuid references auth.users(id) on delete set null,
  source_type text not null,
  source_id text not null,
  event_key text,
  value numeric,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(engine, season_id, student_id, source_type, source_id)
);

alter table public.engine_events enable row level security;

drop policy if exists "Super Admin gerencia engine_events" on public.engine_events;
create policy "Super Admin gerencia engine_events"
  on public.engine_events for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "School Admin vê engine_events da escola" on public.engine_events;
create policy "School Admin vê engine_events da escola"
  on public.engine_events for select
  using (
    exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = engine_events.student_id
      and p.role = 'school_admin'
      and p.school_id = s.school_id
    )
  );

drop policy if exists "Usuário vê engine_events do próprio atleta" on public.engine_events;
create policy "Usuário vê engine_events do próprio atleta"
  on public.engine_events for select
  using (
    exists (
      select 1
      from public.students s
      where s.id = engine_events.student_id
      and s.user_id = auth.uid()
    )
  );

create index if not exists engine_events_student_id_created_at_idx
on public.engine_events (student_id, created_at desc);

create index if not exists engine_events_engine_season_created_at_idx
on public.engine_events (engine, season_id, created_at desc);

create table if not exists public.technical_questions (
  id uuid default gen_random_uuid() primary key,
  season_id uuid references public.seasons(id) on delete cascade not null,
  kind text not null check (kind in ('base', 'position')),
  slot integer not null check (slot in (1, 2, 3)),
  position text,
  key text not null,
  prompt text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(season_id, kind, slot, position, key),
  check ((kind = 'base' and slot = 1 and position is null) or (kind = 'position' and slot in (2, 3) and position is not null))
);

alter table public.technical_questions enable row level security;

drop policy if exists "Todos podem ler technical_questions" on public.technical_questions;
create policy "Todos podem ler technical_questions"
  on public.technical_questions for select
  using (auth.role() = 'authenticated');

drop policy if exists "Super Admin gerencia technical_questions" on public.technical_questions;
create policy "Super Admin gerencia technical_questions"
  on public.technical_questions for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create index if not exists technical_questions_season_kind_slot_idx
on public.technical_questions (season_id, kind, slot);

create index if not exists technical_questions_season_position_idx
on public.technical_questions (season_id, position);

