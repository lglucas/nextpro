create table if not exists public.terms_acceptances (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  terms_version text not null,
  terms_url text,
  accepted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip text,
  user_agent text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, terms_version)
);

alter table public.terms_acceptances enable row level security;

drop policy if exists "Users insert own terms_acceptances" on public.terms_acceptances;
create policy "Users insert own terms_acceptances"
  on public.terms_acceptances
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users view own terms_acceptances" on public.terms_acceptances;
create policy "Users view own terms_acceptances"
  on public.terms_acceptances
  for select
  using (auth.uid() = user_id);

drop policy if exists "Super Admin views all terms_acceptances" on public.terms_acceptances;
create policy "Super Admin views all terms_acceptances"
  on public.terms_acceptances
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create index if not exists terms_acceptances_user_idx
on public.terms_acceptances (user_id, accepted_at desc);

