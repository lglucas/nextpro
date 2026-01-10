alter table public.class_sessions
add column if not exists qr_checkin_expires_at timestamp with time zone;

create index if not exists class_sessions_qr_checkin_expires_at_idx
on public.class_sessions (qr_checkin_expires_at);
