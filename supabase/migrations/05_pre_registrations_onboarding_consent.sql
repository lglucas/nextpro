alter table public.pre_registrations
add column if not exists onboarding_status text not null default 'draft';

alter table public.pre_registrations
drop constraint if exists pre_registrations_onboarding_status_check;

alter table public.pre_registrations
add constraint pre_registrations_onboarding_status_check
check (onboarding_status in ('draft', 'pendente_escola', 'aguardando_contrato', 'ativo', 'rejeitado'));

alter table public.pre_registrations
add column if not exists consented_at timestamp with time zone;

alter table public.pre_registrations
add column if not exists consent_version text;

alter table public.pre_registrations
add column if not exists submitted_meta jsonb not null default '{}'::jsonb;

alter table public.pre_registrations
drop constraint if exists pre_registrations_submitted_requires_consent;

update public.pre_registrations
set onboarding_status = case when status = 'submitted' then 'pendente_escola' else 'draft' end
where status = 'submitted' and onboarding_status = 'draft';

update public.pre_registrations
set consented_at = coalesce(consented_at, submitted_at, updated_at, created_at)
where status = 'submitted' and consented_at is null;

update public.pre_registrations
set consent_version = coalesce(consent_version, '2025-12-26-v1')
where status = 'submitted' and consent_version is null;

alter table public.pre_registrations
add constraint pre_registrations_submitted_requires_consent
check (
  status <> 'submitted'
  or (
    consented_at is not null
    and consent_version is not null
    and onboarding_status <> 'draft'
  )
);

create index if not exists pre_registrations_onboarding_status_idx
on public.pre_registrations (onboarding_status);

