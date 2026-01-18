drop policy if exists "Coach vê engine_events técnicos da escola" on public.engine_events;
create policy "Coach vê engine_events técnicos da escola"
  on public.engine_events for select
  using (
    engine = 'technical'
    and exists (
      select 1
      from public.students s
      join public.profiles p on p.id = auth.uid()
      where s.id = engine_events.student_id
      and p.role = 'coach'
      and p.school_id = s.school_id
    )
  );

