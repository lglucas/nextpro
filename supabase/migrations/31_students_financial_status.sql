alter table public.students
add column if not exists financial_status text;

update public.students
set financial_status = coalesce(financial_status, 'active');

alter table public.students
alter column financial_status set default 'active';

alter table public.students
alter column financial_status set not null;

alter table public.students
drop constraint if exists students_financial_status_check;

alter table public.students
add constraint students_financial_status_check
check (financial_status in ('active', 'warning', 'blocked'));

create index if not exists students_school_financial_status_idx
on public.students (school_id, financial_status);

