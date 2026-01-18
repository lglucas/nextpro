drop policy if exists "Coach/School Admin escreve eventos técnicos" on public.engine_events;
create policy "Coach/School Admin escreve eventos técnicos"
  on public.engine_events for insert
  with check (
    engine = 'technical'
    and exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = engine_events.student_id
      and p.role in ('coach', 'school_admin')
      and p.school_id = s.school_id
    )
  );

drop policy if exists "Coach/School Admin edita eventos próprios" on public.engine_events;
create policy "Coach/School Admin edita eventos próprios"
  on public.engine_events for update
  using (
    actor_id = auth.uid()
    and engine = 'technical'
    and exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = engine_events.student_id
      and p.role in ('coach', 'school_admin')
      and p.school_id = s.school_id
    )
  )
  with check (
    actor_id = auth.uid()
    and engine = 'technical'
    and exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = engine_events.student_id
      and p.role in ('coach', 'school_admin')
      and p.school_id = s.school_id
    )
  );

drop policy if exists "Coach/School Admin remove eventos próprios" on public.engine_events;
create policy "Coach/School Admin remove eventos próprios"
  on public.engine_events for delete
  using (
    actor_id = auth.uid()
    and engine = 'technical'
    and exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = engine_events.student_id
      and p.role in ('coach', 'school_admin')
      and p.school_id = s.school_id
    )
  );

