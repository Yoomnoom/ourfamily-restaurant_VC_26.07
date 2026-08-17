create table public.webauthn_credentials_vc2608 (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles_vc2608(id) on delete cascade,
  credential_id text not null unique,
  public_key text not null,
  counter bigint not null default 0,
  device_label text,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index webauthn_credentials_vc2608_profile_idx on public.webauthn_credentials_vc2608 (profile_id);

alter table public.webauthn_credentials_vc2608 enable row level security;

-- 등록/검증(쓰기)은 서버가 admin 클라이언트로 처리한다. 본인은 자기 패스키 목록 조회·삭제만 가능.
create policy webauthn_credentials_vc2608_select_own on public.webauthn_credentials_vc2608
  for select using (profile_id = auth.uid());

create policy webauthn_credentials_vc2608_delete_own on public.webauthn_credentials_vc2608
  for delete using (profile_id = auth.uid());

grant select, delete on public.webauthn_credentials_vc2608 to authenticated;
grant select, insert, update, delete on public.webauthn_credentials_vc2608 to service_role;
