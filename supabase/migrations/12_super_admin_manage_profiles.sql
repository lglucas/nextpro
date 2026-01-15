-- ==========================================
-- FEATURE: GESTÃO DE PERFIS PELO SUPER ADMIN
-- Data: 2026-01-15
-- Descrição: Permite que Super Admin liste e atualize perfis (profiles)
-- ==========================================

drop policy if exists "Super Admin views all profiles" on public.profiles;
create policy "Super Admin views all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'super_admin'
    )
  );

drop policy if exists "Super Admin updates profiles" on public.profiles;
create policy "Super Admin updates profiles"
  on public.profiles
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'super_admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'super_admin'
    )
  );
