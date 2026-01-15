-- ==========================================
-- FEATURE: PERMISSÕES PARA PROFESSOR (COACH)
-- Data: 2026-01-15
-- Descrição: Adiciona policies RLS para o perfil `coach` operar no dashboard escolar
-- ==========================================

-- Classes (somente leitura)
drop policy if exists "Coach views own school classes" on public.classes;
create policy "Coach views own school classes"
  on public.classes
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'coach'
        and p.school_id = classes.school_id
    )
  );

-- Students (somente leitura)
drop policy if exists "Coach views own school students" on public.students;
create policy "Coach views own school students"
  on public.students
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'coach'
        and p.school_id = students.school_id
    )
  );

-- Matrículas (class_students) — gestão completa para a escola do coach
drop policy if exists "Coach manages own school enrollments" on public.class_students;
create policy "Coach manages own school enrollments"
  on public.class_students
  for all
  using (
    exists (
      select 1
      from public.classes c
      join public.profiles p on p.school_id = c.school_id
      where p.id = auth.uid()
        and p.role = 'coach'
        and c.id = class_students.class_id
    )
  )
  with check (
    exists (
      select 1
      from public.classes c
      join public.profiles p on p.school_id = c.school_id
      where p.id = auth.uid()
        and p.role = 'coach'
        and c.id = class_students.class_id
    )
  );

-- Sessões (class_sessions) — gestão completa para a escola do coach
drop policy if exists "Coach manages own school sessions" on public.class_sessions;
create policy "Coach manages own school sessions"
  on public.class_sessions
  for all
  using (
    exists (
      select 1
      from public.classes c
      join public.profiles p on p.school_id = c.school_id
      where p.id = auth.uid()
        and p.role = 'coach'
        and c.id = class_sessions.class_id
    )
  )
  with check (
    exists (
      select 1
      from public.classes c
      join public.profiles p on p.school_id = c.school_id
      where p.id = auth.uid()
        and p.role = 'coach'
        and c.id = class_sessions.class_id
    )
  );

-- Presenças (attendances) — gestão completa para a escola do coach
drop policy if exists "Coach manages own school attendances" on public.attendances;
create policy "Coach manages own school attendances"
  on public.attendances
  for all
  using (
    exists (
      select 1
      from public.class_sessions sess
      join public.classes c on c.id = sess.class_id
      join public.profiles p on p.school_id = c.school_id
      where p.id = auth.uid()
        and p.role = 'coach'
        and sess.id = attendances.session_id
    )
  )
  with check (
    exists (
      select 1
      from public.class_sessions sess
      join public.classes c on c.id = sess.class_id
      join public.profiles p on p.school_id = c.school_id
      where p.id = auth.uid()
        and p.role = 'coach'
        and sess.id = attendances.session_id
    )
  );
