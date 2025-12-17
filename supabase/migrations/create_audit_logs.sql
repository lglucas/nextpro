-- Tabela de Logs de Auditoria
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null, -- ex: 'create_school', 'delete_user'
  target text, -- ex: 'School A', 'User John'
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.audit_logs enable row level security;

-- Policies
-- 1. Leitura: SuperAdmin e Partners podem ver tudo.
create policy "SuperAdmins and Partners can view audit logs"
  on public.audit_logs
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'partner')
    )
  );

-- 2. Inserção: Apenas usuários autenticados podem inserir (idealmente seria restrito ao backend, mas para MVP vamos permitir insert authenticated para logs de client-side actions)
create policy "Authenticated users can insert audit logs"
  on public.audit_logs
  for insert
  with check (auth.role() = 'authenticated');

-- Comentário sobre roles suportadas: 'super_admin', 'partner', 'school_admin', 'coach', 'guardian', 'athlete', 'user'
