insert into storage.buckets (id, name, public)
values ('student-photos', 'student-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "School staff can upload student photos" on storage.objects;
create policy "School staff can upload student photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'student-photos'
    and (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'super_admin'
      )
      or exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role in ('school_admin', 'coach')
          and p.school_id is not null
          and split_part(name, '/', 1) = p.school_id::text
      )
    )
  );

drop policy if exists "School staff can update student photos" on storage.objects;
create policy "School staff can update student photos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'student-photos'
    and (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'super_admin'
      )
      or exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role in ('school_admin', 'coach')
          and p.school_id is not null
          and split_part(name, '/', 1) = p.school_id::text
      )
    )
  )
  with check (
    bucket_id = 'student-photos'
    and (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'super_admin'
      )
      or exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role in ('school_admin', 'coach')
          and p.school_id is not null
          and split_part(name, '/', 1) = p.school_id::text
      )
    )
  );

drop policy if exists "School staff can delete student photos" on storage.objects;
create policy "School staff can delete student photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'student-photos'
    and (
      exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'super_admin'
      )
      or exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role in ('school_admin', 'coach')
          and p.school_id is not null
          and split_part(name, '/', 1) = p.school_id::text
      )
    )
  );

