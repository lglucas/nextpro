create or replace function public.is_school_admin_of_class(target_class_id uuid)
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
      and p.role = 'school_admin'
      and p.school_id = c.school_id
  );
$$;

drop policy if exists "School Admin manages own enrollments" on public.class_students;
create policy "School Admin manages own enrollments"
  on public.class_students
  for all
  using (public.is_school_admin_of_class(class_id))
  with check (public.is_school_admin_of_class(class_id));

