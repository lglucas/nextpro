-- ==========================================
-- HOTFIX: RLS CLASS_STUDENTS (EVITAR RECURSÃO INFINITA)
-- Data: 2026-01-15
-- Descrição: Ajusta policy de coach em class_students usando função SECURITY DEFINER
-- ==========================================

create or replace function public.is_coach_of_class(target_class_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.classes c on c.id = target_class_id
    where p.id = auth.uid()
      and p.role = 'coach'
      and p.school_id = c.school_id
  );
$$;

drop policy if exists "Coach manages own school enrollments" on public.class_students;
create policy "Coach manages own school enrollments"
  on public.class_students
  for all
  using (public.is_coach_of_class(class_id))
  with check (public.is_coach_of_class(class_id));
