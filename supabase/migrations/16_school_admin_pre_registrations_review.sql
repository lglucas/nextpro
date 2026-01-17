alter table public.pre_registrations
add column if not exists school_id uuid references public.schools(id);

alter table public.pre_registrations
add column if not exists school_reviewed_at timestamp with time zone;

alter table public.pre_registrations
add column if not exists school_reviewed_by uuid references auth.users(id);

alter table public.pre_registrations
add column if not exists school_review_note text;

create index if not exists pre_registrations_school_id_idx
on public.pre_registrations (school_id);

create index if not exists pre_registrations_school_id_onboarding_status_idx
on public.pre_registrations (school_id, onboarding_status);

create or replace function public.pre_registrations_guard_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
  actor_school_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if auth.uid() = old.user_id then
    if old.status = 'submitted' and new.status is distinct from old.status then
      raise exception 'Not allowed';
    end if;

    if new.status = 'draft' and new.onboarding_status is distinct from 'draft' then
      raise exception 'Not allowed';
    end if;

    if new.status = 'submitted' and new.onboarding_status is distinct from 'pendente_escola' then
      raise exception 'Not allowed';
    end if;

    if old.school_id is not null and new.school_id is distinct from old.school_id then
      raise exception 'Not allowed';
    end if;

    if new.school_reviewed_at is distinct from old.school_reviewed_at then
      raise exception 'Not allowed';
    end if;
    if new.school_reviewed_by is distinct from old.school_reviewed_by then
      raise exception 'Not allowed';
    end if;
    if new.school_review_note is distinct from old.school_review_note then
      raise exception 'Not allowed';
    end if;

    return new;
  end if;

  select p.role, p.school_id
  into actor_role, actor_school_id
  from public.profiles p
  where p.id = auth.uid();

  if actor_role = 'super_admin' then
    return new;
  end if;

  if actor_role = 'school_admin' and actor_school_id is not null and actor_school_id = old.school_id then
    if new.user_id is distinct from old.user_id then
      raise exception 'Not allowed';
    end if;
    if new.status is distinct from old.status then
      raise exception 'Not allowed';
    end if;
    if new.data is distinct from old.data then
      raise exception 'Not allowed';
    end if;
    if new.submitted_at is distinct from old.submitted_at then
      raise exception 'Not allowed';
    end if;
    if new.consented_at is distinct from old.consented_at then
      raise exception 'Not allowed';
    end if;
    if new.consent_version is distinct from old.consent_version then
      raise exception 'Not allowed';
    end if;
    if new.submitted_meta is distinct from old.submitted_meta then
      raise exception 'Not allowed';
    end if;
    if new.school_id is distinct from old.school_id then
      raise exception 'Not allowed';
    end if;

    if new.onboarding_status is distinct from old.onboarding_status then
      new.school_reviewed_at = timezone('utc'::text, now());
      new.school_reviewed_by = auth.uid();
    end if;

    return new;
  end if;

  raise exception 'Not authorized';
end;
$$;

drop trigger if exists pre_registrations_guard_update on public.pre_registrations;
create trigger pre_registrations_guard_update
before update on public.pre_registrations
for each row
execute procedure public.pre_registrations_guard_update();

create or replace function public.pre_registrations_guard_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select p.role
  into actor_role
  from public.profiles p
  where p.id = auth.uid();

  if actor_role = 'super_admin' then
    return new;
  end if;

  if auth.uid() is distinct from new.user_id then
    raise exception 'Not allowed';
  end if;

  if new.status = 'draft' and new.onboarding_status is distinct from 'draft' then
    raise exception 'Not allowed';
  end if;

  if new.status = 'submitted' and new.onboarding_status is distinct from 'pendente_escola' then
    raise exception 'Not allowed';
  end if;

  if new.school_reviewed_at is not null then
    raise exception 'Not allowed';
  end if;
  if new.school_reviewed_by is not null then
    raise exception 'Not allowed';
  end if;
  if new.school_review_note is not null then
    raise exception 'Not allowed';
  end if;

  return new;
end;
$$;

drop trigger if exists pre_registrations_guard_insert on public.pre_registrations;
create trigger pre_registrations_guard_insert
before insert on public.pre_registrations
for each row
execute procedure public.pre_registrations_guard_insert();

drop policy if exists "School Admin views school pre_registrations" on public.pre_registrations;
create policy "School Admin views school pre_registrations"
  on public.pre_registrations
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'school_admin'
        and p.school_id = pre_registrations.school_id
    )
  );

drop policy if exists "School Admin updates school pre_registrations" on public.pre_registrations;
create policy "School Admin updates school pre_registrations"
  on public.pre_registrations
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'school_admin'
        and p.school_id = pre_registrations.school_id
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'school_admin'
        and p.school_id = pre_registrations.school_id
    )
  );
