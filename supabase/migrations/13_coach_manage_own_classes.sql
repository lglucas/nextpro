-- ==========================================
-- FEATURE: TURMAS CRIADAS PELO PROFESSOR (COACH)
-- Data: 2026-01-15
-- Descrição: Permite que o professor crie/edite/remova suas próprias turmas
-- ==========================================

drop policy if exists "Coach inserts own classes" on public.classes;
create policy "Coach inserts own classes"
  on public.classes
  for insert
  with check (
    teacher_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'coach'
        and p.school_id = classes.school_id
    )
  );

drop policy if exists "Coach updates own classes" on public.classes;
create policy "Coach updates own classes"
  on public.classes
  for update
  using (
    teacher_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'coach'
        and p.school_id = classes.school_id
    )
  )
  with check (
    teacher_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'coach'
        and p.school_id = classes.school_id
    )
  );

drop policy if exists "Coach deletes own classes" on public.classes;
create policy "Coach deletes own classes"
  on public.classes
  for delete
  using (
    teacher_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'coach'
        and p.school_id = classes.school_id
    )
  );
