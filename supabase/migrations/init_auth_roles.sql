-- Cria a tabela de perfis se não existir
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Política: Usuários podem ver seus próprios perfis
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Política: Apenas o sistema (ou triggers) pode inserir/atualizar perfis (bloqueia escrita direta do frontend)
-- Nenhuma policy de insert/update para 'public' garante que só triggers ou service_role consigam escrever.

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
