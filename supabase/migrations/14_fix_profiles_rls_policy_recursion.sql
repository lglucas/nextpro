-- ==========================================
-- HOTFIX: RLS PROFILES (EVITAR RECURSÃO INFINITA)
-- Data: 2026-01-15
-- Descrição: Ajusta policies de `profiles` para não consultarem `profiles` dentro da própria policy
-- ==========================================

-- Mantém a policy de "ver o próprio perfil" e adiciona acesso de Super Admin baseado no email do JWT.
-- Isso evita a recursão infinita ao consultar `profiles` dentro de `profiles`.

alter table public.profiles enable row level security;

drop policy if exists "Super Admin views all profiles" on public.profiles;
drop policy if exists "Super Admin updates profiles" on public.profiles;

drop policy if exists "Super Admin views all profiles (by email)" on public.profiles;
create policy "Super Admin views all profiles (by email)"
  on public.profiles
  for select
  using ((auth.jwt() ->> 'email') = 'contato@lucasgalvao.com.br');

drop policy if exists "Super Admin updates profiles (by email)" on public.profiles;
create policy "Super Admin updates profiles (by email)"
  on public.profiles
  for update
  using ((auth.jwt() ->> 'email') = 'contato@lucasgalvao.com.br')
  with check ((auth.jwt() ->> 'email') = 'contato@lucasgalvao.com.br');
