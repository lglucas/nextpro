create table if not exists public.seasons (
  id uuid default gen_random_uuid() primary key,
  year integer not null unique check (year >= 2000),
  starts_at date not null,
  ends_at date not null,
  is_active boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.seasons enable row level security;

drop policy if exists "Todos podem ler seasons" on public.seasons;
create policy "Todos podem ler seasons"
  on public.seasons for select
  using (auth.role() = 'authenticated');

drop policy if exists "Super Admin gerencia seasons" on public.seasons;
create policy "Super Admin gerencia seasons"
  on public.seasons for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create unique index if not exists seasons_one_active_idx
on public.seasons ((is_active))
where is_active;

insert into public.seasons (year, starts_at, ends_at, is_active)
values (2026, '2026-01-01'::date, '2026-12-31'::date, true)
on conflict (year) do update set
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at;

create table if not exists public.nuclei (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  uf text,
  city text,
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, uf, city)
);

alter table public.nuclei enable row level security;

drop policy if exists "Todos podem ler nuclei" on public.nuclei;
create policy "Todos podem ler nuclei"
  on public.nuclei for select
  using (auth.role() = 'authenticated');

drop policy if exists "Super Admin gerencia nuclei" on public.nuclei;
create policy "Super Admin gerencia nuclei"
  on public.nuclei for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create table if not exists public.school_nuclei (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.schools(id) on delete cascade not null,
  nucleus_id uuid references public.nuclei(id) on delete cascade not null,
  season_id uuid references public.seasons(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(school_id, season_id)
);

alter table public.school_nuclei enable row level security;

drop policy if exists "Todos podem ler school_nuclei" on public.school_nuclei;
create policy "Todos podem ler school_nuclei"
  on public.school_nuclei for select
  using (auth.role() = 'authenticated');

drop policy if exists "Super Admin gerencia school_nuclei" on public.school_nuclei;
create policy "Super Admin gerencia school_nuclei"
  on public.school_nuclei for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create index if not exists school_nuclei_season_id_idx
on public.school_nuclei (season_id);

create index if not exists school_nuclei_nucleus_id_idx
on public.school_nuclei (nucleus_id);

