alter table public.pre_registrations enable row level security;
alter table public.school_suggestions enable row level security;

drop policy if exists "Super Admin manages all pre_registrations" on public.pre_registrations;
create policy "Super Admin manages all pre_registrations"
  on public.pre_registrations
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "Super Admin views all school_suggestions" on public.school_suggestions;
create policy "Super Admin views all school_suggestions"
  on public.school_suggestions
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

