-- Adiciona school_id ao perfil para vincular administradores e professores a uma escola
alter table public.profiles 
add column if not exists school_id uuid references public.schools(id);

-- Cria a tabela de alunos (Students/Athletes)
create table if not exists public.students (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  birth_date date,
  gender text, -- 'M', 'F', 'O'
  photo_url text,
  
  -- Dados de Saúde
  blood_type text,
  allergies text,
  medical_conditions text,
  emergency_contact text,
  emergency_phone text,
  
  -- Dados do Responsável (Simplificado para Sprint 3)
  guardian_name text,
  guardian_phone text,
  guardian_email text,
  
  -- Sistema
  school_id uuid references public.schools(id) not null,
  user_id uuid references auth.users(id), -- Link futuro com conta de usuário
  category text, -- Sub-10, Sub-12, etc. (Pode ser calculado ou fixo)
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS
alter table public.students enable row level security;

-- Policies para Students

-- 1. Super Admin tem acesso total
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

-- 2. School Admin vê e edita apenas alunos da sua escola
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

-- 3. Partners (Sócios) podem ver alunos de todas as escolas (ou da sua, dependendo da regra. Assumindo global por enquanto para simplificar ou read-only)
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
