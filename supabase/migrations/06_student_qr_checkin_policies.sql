drop policy if exists "Users view own student" on public.students;
create policy "Users view own student"
  on public.students
  for select
  using (user_id = auth.uid());

drop policy if exists "Users view own enrollments" on public.class_students;
create policy "Users view own enrollments"
  on public.class_students
  for select
  using (
    exists (
      select 1
      from public.students
      where students.id = class_students.student_id
        and students.user_id = auth.uid()
    )
  );

drop policy if exists "Users view own classes" on public.classes;
create policy "Users view own classes"
  on public.classes
  for select
  using (
    exists (
      select 1
      from public.class_students
      join public.students on students.id = class_students.student_id
      where class_students.class_id = classes.id
        and students.user_id = auth.uid()
    )
  );

drop policy if exists "Users view own sessions" on public.class_sessions;
create policy "Users view own sessions"
  on public.class_sessions
  for select
  using (
    exists (
      select 1
      from public.class_students
      join public.students on students.id = class_students.student_id
      where class_students.class_id = class_sessions.class_id
        and students.user_id = auth.uid()
    )
  );

drop policy if exists "Users view own attendances" on public.attendances;
create policy "Users view own attendances"
  on public.attendances
  for select
  using (
    exists (
      select 1
      from public.students
      where students.id = attendances.student_id
        and students.user_id = auth.uid()
    )
  );

drop policy if exists "Users check in own attendance" on public.attendances;
create policy "Users check in own attendance"
  on public.attendances
  for insert
  with check (
    status = 'present'
    and exists (
      select 1
      from public.students s
      where s.id = student_id
        and s.user_id = auth.uid()
    )
    and exists (
      select 1
      from public.class_sessions sess
      join public.class_students cs on cs.class_id = sess.class_id
      join public.students s on s.id = cs.student_id
      where sess.id = session_id
        and s.id = student_id
        and s.user_id = auth.uid()
        and sess.date = current_date
        and sess.qr_checkin_expires_at is not null
        and now() <= sess.qr_checkin_expires_at
    )
  );

drop policy if exists "Users update own attendance" on public.attendances;
create policy "Users update own attendance"
  on public.attendances
  for update
  using (
    exists (
      select 1
      from public.students s
      where s.id = attendances.student_id
        and s.user_id = auth.uid()
    )
  )
  with check (
    status = 'present'
    and exists (
      select 1
      from public.class_sessions sess
      join public.class_students cs on cs.class_id = sess.class_id
      join public.students s on s.id = cs.student_id
      where sess.id = session_id
        and s.id = student_id
        and s.user_id = auth.uid()
        and sess.date = current_date
        and sess.qr_checkin_expires_at is not null
        and now() <= sess.qr_checkin_expires_at
    )
  );
