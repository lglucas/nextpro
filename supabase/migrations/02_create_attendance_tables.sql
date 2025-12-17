-- ==========================================
-- FEATURE: FREQUÊNCIA E CHAMADA
-- Data: 2025-12-16
-- Descrição: Cria tabelas para sessões de aula e registros de presença
-- ==========================================

-- 1. Sessões de Aula (Class Sessions)
create table if not exists public.class_sessions (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  date date not null,
  start_time time,
  end_time time,
  topic text, -- Conteúdo da aula
  notes text, -- Observações gerais
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS para Class Sessions
alter table public.class_sessions enable row level security;

create policy "Super Admin manages all sessions"
  on public.class_sessions for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create policy "School Admin manages own school sessions"
  on public.class_sessions for all
  using (
    exists (
      select 1 from public.classes
      where classes.id = class_sessions.class_id
      and exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'school_admin'
        and profiles.school_id = classes.school_id
      )
    )
  );

-- 2. Registros de Presença (Attendances)
create table if not exists public.attendances (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.class_sessions(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete cascade not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  notes text, -- Motivo da falta ou observação individual
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(session_id, student_id) -- Um aluno só pode ter um registro por sessão
);

-- RLS para Attendances
alter table public.attendances enable row level security;

create policy "Super Admin manages all attendances"
  on public.attendances for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create policy "School Admin manages own school attendances"
  on public.attendances for all
  using (
    exists (
      select 1 from public.class_sessions
      join public.classes on classes.id = class_sessions.class_id
      where class_sessions.id = attendances.session_id
      and exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'school_admin'
        and profiles.school_id = classes.school_id
      )
    )
  );
