create table if not exists public.schools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  document text,
  address text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.schools enable row level security;

-- Policies
create policy "SuperAdmins have full access to schools"
  on public.schools
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create policy "Partners can view schools"
  on public.schools
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'partner'
    )
  );

-- Log triggers (audit) would be nice here too, but I'll stick to basic CRUD first.
