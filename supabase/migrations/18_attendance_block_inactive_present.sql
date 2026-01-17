create or replace function public.block_present_for_inactive_students()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_active boolean;
begin
  if new.status <> 'present' then
    return new;
  end if;

  select s.active into is_active
  from public.students s
  where s.id = new.student_id;

  if coalesce(is_active, false) = false then
    raise exception 'Aluno inativo: presença não pode ser marcada como presente';
  end if;

  return new;
end;
$$;

drop trigger if exists attendances_block_present_for_inactive_students on public.attendances;
create trigger attendances_block_present_for_inactive_students
before insert or update of status on public.attendances
for each row
execute procedure public.block_present_for_inactive_students();

