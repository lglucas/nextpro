-- ==========================================
-- 1. SETUP DE PERFIS E AUTH (init_auth_roles.sql)
-- ==========================================

-- Cria a tabela de perfis se não existir
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Função para lidar com novos usuários
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    -- Regra Mágica: Se for o email do Lucas, vira super_admin
    case 
      when new.email = 'contato@lucasgalvao.com.br' then 'super_admin'
      else 'user'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que dispara após insert em auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- 2. LOGS DE AUDITORIA E SETTINGS (create_audit_and_settings.sql)
-- ==========================================

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;

drop policy if exists "Qualquer usuário autenticado pode criar logs" on public.audit_logs;
create policy "Qualquer usuário autenticado pode criar logs"
  on public.audit_logs for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Apenas Super Admins podem ver logs" on public.audit_logs;
create policy "Apenas Super Admins podem ver logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

alter table public.system_settings enable row level security;

drop policy if exists "Todos podem ler configurações" on public.system_settings;
create policy "Todos podem ler configurações"
  on public.system_settings for select
  using (auth.role() = 'authenticated');

drop policy if exists "Apenas Super Admins podem alterar configurações" on public.system_settings;
create policy "Apenas Super Admins podem alterar configurações"
  on public.system_settings for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

insert into public.system_settings (key, value, description)
values 
  ('xp_base', '10', 'Quantidade base de XP por presença'),
  ('financial_block_days', '5', 'Dias de atraso para bloqueio financeiro')
on conflict (key) do nothing;


-- ==========================================
-- 3. ESCOLAS (create_schools_table.sql)
-- ==========================================

create table if not exists public.schools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  document text,
  address text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.schools enable row level security;

drop policy if exists "SuperAdmins have full access to schools" on public.schools;
create policy "SuperAdmins have full access to schools"
  on public.schools
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "Partners can view schools" on public.schools;
create policy "Partners can view schools"
  on public.schools
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'partner'
    )
  );


-- ==========================================
-- 4. ALUNOS E UPDATE DE PERFIL (create_students_table.sql)
-- ==========================================

-- Adiciona school_id ao perfil (AGORA É SEGURO PORQUE SCHOOLS EXISTE)
alter table public.profiles 
add column if not exists school_id uuid references public.schools(id);

create table if not exists public.students (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  birth_date date,
  gender text,
  photo_url text,
  blood_type text,
  allergies text,
  medical_conditions text,
  emergency_contact text,
  emergency_phone text,
  guardian_name text,
  guardian_phone text,
  guardian_email text,
  school_id uuid references public.schools(id) not null,
  user_id uuid references auth.users(id),
  category text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.students enable row level security;

drop policy if exists "Super Admin manages all students" on public.students;
create policy "Super Admin manages all students"
  on public.students
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "School Admin manages own students" on public.students;
create policy "School Admin manages own students"
  on public.students
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'school_admin'
      and profiles.school_id = students.school_id
    )
  );

drop policy if exists "Partners view all students" on public.students;
create policy "Partners view all students"
  on public.students
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'partner'
    )
  );


-- ==========================================
-- 5. TURMAS (create_classes_table.sql)
-- ==========================================

create table if not exists public.classes (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.schools(id) not null,
  name text not null,
  category text,
  days text[],
  start_time time,
  end_time time,
  teacher_id uuid references auth.users(id),
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.classes enable row level security;

drop policy if exists "Super Admin manages all classes" on public.classes;
create policy "Super Admin manages all classes"
  on public.classes for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

drop policy if exists "School Admin manages own classes" on public.classes;
create policy "School Admin manages own classes"
  on public.classes for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'school_admin'
      and profiles.school_id = classes.school_id
    )
  );

drop policy if exists "Partners view all classes" on public.classes;
create policy "Partners view all classes"
  on public.classes for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'partner'
    )
  );
