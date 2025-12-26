create table if not exists public.pre_registrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  data jsonb not null default '{}'::jsonb,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table public.pre_registrations enable row level security;

create or replace function public.pre_registrations_set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists pre_registrations_set_updated_at on public.pre_registrations;
create trigger pre_registrations_set_updated_at
  before update on public.pre_registrations
  for each row execute procedure public.pre_registrations_set_updated_at();

drop policy if exists "Users manage own pre_registrations" on public.pre_registrations;
create policy "Users manage own pre_registrations"
  on public.pre_registrations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.school_suggestions (
  id uuid default gen_random_uuid() primary key,
  created_by uuid references auth.users(id) on delete cascade not null,
  uf text not null,
  city text not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.school_suggestions enable row level security;

drop policy if exists "Users insert school_suggestions" on public.school_suggestions;
create policy "Users insert school_suggestions"
  on public.school_suggestions
  for insert
  with check (auth.uid() = created_by);

drop policy if exists "Users view own school_suggestions" on public.school_suggestions;
create policy "Users view own school_suggestions"
  on public.school_suggestions
  for select
  using (auth.uid() = created_by);

