create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  page_url text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone inserts contact_messages" on public.contact_messages;
create policy "Anyone inserts contact_messages"
  on public.contact_messages
  for insert
  with check (true);

drop policy if exists "Super Admin views all contact_messages" on public.contact_messages;
create policy "Super Admin views all contact_messages"
  on public.contact_messages
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'super_admin'
    )
  );

create index if not exists contact_messages_created_at_idx
on public.contact_messages (created_at desc);

