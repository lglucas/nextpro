create table if not exists public.technical_monthly_questions (
  id uuid default gen_random_uuid() primary key,
  season_id uuid references public.seasons(id) on delete cascade not null,
  kind text not null check (kind in ('base', 'position')),
  position text,
  key text not null,
  prompt text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(season_id, kind, position, key),
  check ((kind = 'base' and position is null) or (kind = 'position' and position is not null))
);

alter table public.technical_monthly_questions enable row level security;

drop policy if exists "Todos podem ler technical_monthly_questions" on public.technical_monthly_questions;
create policy "Todos podem ler technical_monthly_questions"
  on public.technical_monthly_questions for select
  using (auth.role() = 'authenticated');

drop policy if exists "Super Admin gerencia technical_monthly_questions" on public.technical_monthly_questions;
create policy "Super Admin gerencia technical_monthly_questions"
  on public.technical_monthly_questions for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create index if not exists technical_monthly_questions_season_kind_idx
on public.technical_monthly_questions (season_id, kind);

create index if not exists technical_monthly_questions_season_position_idx
on public.technical_monthly_questions (season_id, position);

