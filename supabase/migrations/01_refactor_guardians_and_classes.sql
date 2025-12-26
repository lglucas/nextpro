-- ==========================================
-- REFACTOR: GUARDIANS E CLASS_STUDENTS
-- Data: 2025-12-16
-- Descrição: Cria tabela de responsáveis e tabela de ligação aluno-turma
-- ==========================================

-- 1. Tabela de Responsáveis (Guardians)
create table if not exists public.guardians (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  cpf text unique,
  email text,
  phone text,
  user_id uuid references auth.users(id), -- Link futuro para login
  school_id uuid references public.schools(id), -- Responsável vinculado a uma escola (contexto inicial)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS para Guardians
alter table public.guardians enable row level security;

create policy "Super Admin manages all guardians"
  on public.guardians for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create policy "School Admin manages own school guardians"
  on public.guardians for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'school_admin'
      and profiles.school_id = guardians.school_id
    )
  );

-- 2. Atualizar Students para linkar com Guardian
alter table public.students 
add column if not exists guardian_id uuid references public.guardians(id);

-- 3. Tabela de Ligação Turma-Aluno (Matrícula)
create table if not exists public.class_students (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(class_id, student_id)
);

-- RLS para Class Students
alter table public.class_students enable row level security;

create policy "Super Admin manages all enrollments"
  on public.class_students for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create policy "School Admin manages own enrollments"
  on public.class_students for all
  using (
    exists (
      select 1 from public.classes
      where classes.id = class_students.class_id
      and exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'school_admin'
        and profiles.school_id = classes.school_id
      )
    )
  );
