-- Tabela de Logs de Auditoria
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.audit_logs enable row level security;

-- Políticas de Acesso
create policy "Qualquer usuário autenticado pode criar logs"
  on public.audit_logs for insert
  with check (auth.role() = 'authenticated');

create policy "Apenas Super Admins podem ver logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

-- Tabela de Configurações do Sistema
create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

-- Habilitar RLS
alter table public.system_settings enable row level security;

-- Políticas de Acesso
create policy "Todos podem ler configurações"
  on public.system_settings for select
  using (auth.role() = 'authenticated');

create policy "Apenas Super Admins podem alterar configurações"
  on public.system_settings for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

-- Inserir configurações padrão
insert into public.system_settings (key, value, description)
values 
  ('xp_base', '10', 'Quantidade base de XP por presença'),
  ('financial_block_days', '5', 'Dias de atraso para bloqueio financeiro')
on conflict (key) do nothing;
