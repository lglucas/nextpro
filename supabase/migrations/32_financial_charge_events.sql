create table if not exists public.financial_charge_events (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.students(id) on delete cascade not null,
  guardian_id uuid references public.guardians(id) on delete set null,
  school_id uuid references public.schools(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  channel text not null,
  template text,
  status_at_time text,
  meta jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists financial_charge_events_student_created_at_idx
  on public.financial_charge_events (student_id, created_at desc);

create index if not exists financial_charge_events_school_created_at_idx
  on public.financial_charge_events (school_id, created_at desc);

alter table public.financial_charge_events enable row level security;

drop policy if exists "SuperAdmins and Partners can view financial charge events" on public.financial_charge_events;
create policy "SuperAdmins and Partners can view financial charge events"
  on public.financial_charge_events
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'partner')
    )
  );

drop policy if exists "School Admin views own school financial charge events" on public.financial_charge_events;
create policy "School Admin views own school financial charge events"
  on public.financial_charge_events
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'school_admin'
      and profiles.school_id = financial_charge_events.school_id
    )
  );

drop policy if exists "School Admin inserts financial charge events" on public.financial_charge_events;
create policy "School Admin inserts financial charge events"
  on public.financial_charge_events
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'school_admin')
    )
  );
