create table if not exists public.classes (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.schools(id) not null,
  name text not null, -- Ex: "Sub-10 Manhã"
  category text, -- Ex: "Sub-10"
  days text[], -- Ex: ['Mon', 'Wed']
  start_time time,
  end_time time,
  teacher_id uuid references auth.users(id), -- Opcional, futuro
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.classes enable row level security;

-- Policies
create policy "Super Admin manages all classes"
  on public.classes for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

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

-- Permitir leitura para Partners (Opcional, mas consistente)
create policy "Partners view all classes"
  on public.classes for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'partner'
    )
  );
