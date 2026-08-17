-- 우리집식당 초기 스키마
-- 이 Supabase 프로젝트는 다른 개인 프로젝트들과 공유되므로 모든 테이블/함수/트리거 이름에
-- _vc2608 접미사를 붙여 이름 충돌(특히 기존 profiles, notifications, handle_new_user)을 피한다.
-- 날짜/시간 정책: date, time은 타임존 없이 저장하고 Asia/Seoul 기준 로컬 값으로 취급한다.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at_vc2608()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles_vc2608 ---------------------------------------------------------

create table public.profiles_vc2608 (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_vc2608_set_updated_at
  before update on public.profiles_vc2608
  for each row execute function public.set_updated_at_vc2608();

create or replace function public.handle_new_user_vc2608()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles_vc2608 (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created_vc2608
  after insert on auth.users
  for each row execute function public.handle_new_user_vc2608();

-- households_vc2608 ---------------------------------------------------------

create table public.households_vc2608 (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles_vc2608(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger households_vc2608_set_updated_at
  before update on public.households_vc2608
  for each row execute function public.set_updated_at_vc2608();

-- RLS만으로는 컬럼 단위 제한이 어려워, owner_id 변경은 현재 오너만 가능하도록 트리거로 막는다.
-- (household_members_vc2608.role='owner' 위임은 transfer_household_owner_vc2608 RPC를 통해서만 일어난다.)
create or replace function public.guard_household_owner_change_vc2608()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.owner_id is distinct from old.owner_id and auth.uid() is distinct from old.owner_id then
    raise exception 'not_authorized';
  end if;
  return new;
end;
$$;

create trigger households_vc2608_guard_owner_change
  before update on public.households_vc2608
  for each row execute function public.guard_household_owner_change_vc2608();

create table public.household_members_vc2608 (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households_vc2608(id) on delete cascade,
  profile_id uuid not null references public.profiles_vc2608(id) on delete cascade,
  role text not null check (role in ('owner', 'co-admin', 'member')),
  joined_at timestamptz not null default now(),
  unique (household_id, profile_id)
);

create index household_members_vc2608_profile_idx on public.household_members_vc2608 (profile_id);

create table public.household_invites_vc2608 (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households_vc2608(id) on delete cascade,
  code_hash text not null unique,
  created_by uuid not null references public.profiles_vc2608(id),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- meals_vc2608 ---------------------------------------------------------

create table public.meals_vc2608 (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households_vc2608(id) on delete cascade,
  creator_id uuid not null references public.profiles_vc2608(id),
  date date not null,
  time time not null,
  kind text not null default '집밥',
  menu text not null,
  note text not null default '',
  status text not null default 'open' check (status in ('open', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index meals_vc2608_household_date_idx on public.meals_vc2608 (household_id, date);

create trigger meals_vc2608_set_updated_at
  before update on public.meals_vc2608
  for each row execute function public.set_updated_at_vc2608();

create table public.meal_participants_vc2608 (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals_vc2608(id) on delete cascade,
  profile_id uuid not null references public.profiles_vc2608(id) on delete cascade,
  unique (meal_id, profile_id)
);

create table public.meal_responses_vc2608 (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals_vc2608(id) on delete cascade,
  profile_id uuid references public.profiles_vc2608(id) on delete cascade,
  guest_token text,
  guest_name text,
  is_guest boolean not null default false,
  status text not null check (status in ('attending', 'absent')),
  arrival_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meal_responses_vc2608_member_or_guest check (
    (is_guest = false and profile_id is not null and guest_token is null)
    or (is_guest = true and profile_id is null and guest_token is not null and guest_name is not null)
  )
);

create unique index meal_responses_vc2608_member_unique
  on public.meal_responses_vc2608 (meal_id, profile_id)
  where profile_id is not null;

create unique index meal_responses_vc2608_guest_unique
  on public.meal_responses_vc2608 (meal_id, guest_token)
  where guest_token is not null;

create trigger meal_responses_vc2608_set_updated_at
  before update on public.meal_responses_vc2608
  for each row execute function public.set_updated_at_vc2608();

create table public.meal_share_links_vc2608 (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals_vc2608(id) on delete cascade,
  token_hash text not null unique,
  created_by uuid not null references public.profiles_vc2608(id),
  revoked_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index meal_share_links_vc2608_meal_idx on public.meal_share_links_vc2608 (meal_id);

-- menu_requests_vc2608 ---------------------------------------------------------

create table public.menu_requests_vc2608 (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households_vc2608(id) on delete cascade,
  profile_id uuid not null references public.profiles_vc2608(id) on delete cascade,
  menu text not null,
  created_at timestamptz not null default now()
);

-- notifications_vc2608 ---------------------------------------------------------

create table public.notifications_vc2608 (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households_vc2608(id) on delete cascade,
  profile_id uuid not null references public.profiles_vc2608(id) on delete cascade,
  meal_id uuid references public.meals_vc2608(id) on delete set null,
  text text not null,
  detail text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_vc2608_profile_idx on public.notifications_vc2608 (profile_id, read);

-- membership helper functions (security definer avoids RLS recursion) ------

create or replace function public.is_household_member_vc2608(target_household uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.household_members_vc2608
    where household_id = target_household and profile_id = auth.uid()
  );
$$;

create or replace function public.is_household_admin_vc2608(target_household uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.household_members_vc2608
    where household_id = target_household
      and profile_id = auth.uid()
      and role in ('owner', 'co-admin')
  );
$$;

grant execute on function public.is_household_member_vc2608(uuid) to authenticated;
grant execute on function public.is_household_admin_vc2608(uuid) to authenticated;

-- household/invite RPCs ---------------------------------------------------

create or replace function public.create_household_vc2608(household_name text)
returns public.households_vc2608
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household public.households_vc2608;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  insert into public.households_vc2608 (name, owner_id) values (household_name, auth.uid())
  returning * into new_household;

  insert into public.household_members_vc2608 (household_id, profile_id, role)
  values (new_household.id, auth.uid(), 'owner');

  return new_household;
end;
$$;

grant execute on function public.create_household_vc2608(text) to authenticated;

create or replace function public.create_household_invite_vc2608(target_household uuid, code_hash text, expires_at timestamptz default null)
returns public.household_invites_vc2608
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.household_invites_vc2608;
begin
  if not public.is_household_admin_vc2608(target_household) then
    raise exception 'not_authorized';
  end if;

  insert into public.household_invites_vc2608 (household_id, code_hash, created_by, expires_at)
  values (target_household, code_hash, auth.uid(), expires_at)
  returning * into result;

  return result;
end;
$$;

grant execute on function public.create_household_invite_vc2608(uuid, text, timestamptz) to authenticated;

create or replace function public.redeem_household_invite_vc2608(invite_code_hash text)
returns public.households_vc2608
language plpgsql
security definer
set search_path = public
as $$
declare
  invite public.household_invites_vc2608;
  result public.households_vc2608;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into invite from public.household_invites_vc2608
  where code_hash = invite_code_hash
    and revoked_at is null
    and (expires_at is null or expires_at > now())
  limit 1;

  if invite is null then
    raise exception 'invalid_or_expired_invite';
  end if;

  insert into public.household_members_vc2608 (household_id, profile_id, role)
  values (invite.household_id, auth.uid(), 'member')
  on conflict (household_id, profile_id) do nothing;

  select * into result from public.households_vc2608 where id = invite.household_id;
  return result;
end;
$$;

grant execute on function public.redeem_household_invite_vc2608(text) to authenticated;

create or replace function public.transfer_household_owner_vc2608(target_household uuid, new_owner_profile uuid)
returns public.households_vc2608
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.households_vc2608;
begin
  if not exists (select 1 from public.households_vc2608 where id = target_household and owner_id = auth.uid()) then
    raise exception 'not_authorized';
  end if;

  if not exists (select 1 from public.household_members_vc2608 where household_id = target_household and profile_id = new_owner_profile) then
    raise exception 'target_not_member';
  end if;

  update public.households_vc2608 set owner_id = new_owner_profile where id = target_household
  returning * into result;

  update public.household_members_vc2608 set role = 'co-admin' where household_id = target_household and profile_id = auth.uid() and role = 'owner';
  update public.household_members_vc2608 set role = 'owner' where household_id = target_household and profile_id = new_owner_profile;

  return result;
end;
$$;

grant execute on function public.transfer_household_owner_vc2608(uuid, uuid) to authenticated;

-- guest share-link RPCs (anon) ---------------------------------------------

create or replace function public.get_meal_by_share_token_vc2608(share_token_hash text)
returns table (
  meal_id uuid,
  household_id uuid,
  date date,
  "time" time,
  kind text,
  menu text,
  note text,
  status text
)
language sql
security definer
set search_path = public
stable
as $$
  select m.id, m.household_id, m.date, m.time, m.kind, m.menu, m.note, m.status
  from public.meal_share_links_vc2608 l
  join public.meals_vc2608 m on m.id = l.meal_id
  where l.token_hash = share_token_hash
    and l.revoked_at is null
    and (l.expires_at is null or l.expires_at > now())
  limit 1;
$$;

grant execute on function public.get_meal_by_share_token_vc2608(text) to anon, authenticated;

create or replace function public.get_guest_response_vc2608(share_token_hash text, guest_token_value text)
returns public.meal_responses_vc2608
language sql
security definer
set search_path = public
stable
as $$
  select r.*
  from public.meal_responses_vc2608 r
  join public.meal_share_links_vc2608 l on l.meal_id = r.meal_id
  where l.token_hash = share_token_hash
    and l.revoked_at is null
    and (l.expires_at is null or l.expires_at > now())
    and r.guest_token = guest_token_value
  limit 1;
$$;

grant execute on function public.get_guest_response_vc2608(text, text) to anon, authenticated;

create or replace function public.submit_guest_meal_response_vc2608(
  share_token_hash text,
  guest_token_value text,
  guest_display_name text,
  response_status text,
  response_arrival_time time
)
returns public.meal_responses_vc2608
language plpgsql
security definer
set search_path = public
as $$
declare
  link public.meal_share_links_vc2608;
  result public.meal_responses_vc2608;
begin
  select * into link from public.meal_share_links_vc2608 l
  where l.token_hash = share_token_hash
    and l.revoked_at is null
    and (l.expires_at is null or l.expires_at > now())
  limit 1;

  if link is null then
    raise exception 'invalid_or_expired_link';
  end if;

  if response_status not in ('attending', 'absent') then
    raise exception 'invalid_status';
  end if;

  insert into public.meal_responses_vc2608 (meal_id, guest_token, guest_name, is_guest, status, arrival_time)
  values (link.meal_id, guest_token_value, guest_display_name, true, response_status, response_arrival_time)
  on conflict (meal_id, guest_token) where guest_token is not null
  do update set
    guest_name = excluded.guest_name,
    status = excluded.status,
    arrival_time = excluded.arrival_time,
    updated_at = now()
  returning * into result;

  return result;
end;
$$;

grant execute on function public.submit_guest_meal_response_vc2608(text, text, text, text, time) to anon, authenticated;

-- row level security ---------------------------------------------------

alter table public.profiles_vc2608 enable row level security;
alter table public.households_vc2608 enable row level security;
alter table public.household_members_vc2608 enable row level security;
alter table public.household_invites_vc2608 enable row level security;
alter table public.meals_vc2608 enable row level security;
alter table public.meal_participants_vc2608 enable row level security;
alter table public.meal_responses_vc2608 enable row level security;
alter table public.meal_share_links_vc2608 enable row level security;
alter table public.menu_requests_vc2608 enable row level security;
alter table public.notifications_vc2608 enable row level security;

-- profiles_vc2608: 본인 행 + 같은 가구 구성원의 행은 조회 가능
create policy profiles_vc2608_select on public.profiles_vc2608
  for select using (
    id = auth.uid()
    or exists (
      select 1 from public.household_members_vc2608 mine
      join public.household_members_vc2608 theirs on theirs.household_id = mine.household_id
      where mine.profile_id = auth.uid() and theirs.profile_id = profiles_vc2608.id
    )
  );

create policy profiles_vc2608_update_own on public.profiles_vc2608
  for update using (id = auth.uid());

-- households_vc2608
create policy households_vc2608_select on public.households_vc2608
  for select using (public.is_household_member_vc2608(id));

create policy households_vc2608_update_admin on public.households_vc2608
  for update using (public.is_household_admin_vc2608(id));

create policy households_vc2608_delete_owner on public.households_vc2608
  for delete using (owner_id = auth.uid());

-- household_members_vc2608
create policy household_members_vc2608_select on public.household_members_vc2608
  for select using (public.is_household_member_vc2608(household_id));

create policy household_members_vc2608_admin_manage on public.household_members_vc2608
  for all using (public.is_household_admin_vc2608(household_id))
  with check (public.is_household_admin_vc2608(household_id));

create policy household_members_vc2608_self_leave on public.household_members_vc2608
  for delete using (profile_id = auth.uid());

-- household_invites_vc2608: 관리자만 조회/관리, 발급은 RPC로만
create policy household_invites_vc2608_admin on public.household_invites_vc2608
  for all using (public.is_household_admin_vc2608(household_id))
  with check (public.is_household_admin_vc2608(household_id));

-- meals_vc2608
create policy meals_vc2608_select on public.meals_vc2608
  for select using (public.is_household_member_vc2608(household_id));

create policy meals_vc2608_insert on public.meals_vc2608
  for insert with check (public.is_household_member_vc2608(household_id) and creator_id = auth.uid());

create policy meals_vc2608_update on public.meals_vc2608
  for update using (public.is_household_member_vc2608(household_id));

-- meal_participants_vc2608
create policy meal_participants_vc2608_select on public.meal_participants_vc2608
  for select using (
    exists (select 1 from public.meals_vc2608 m where m.id = meal_id and public.is_household_member_vc2608(m.household_id))
  );

create policy meal_participants_vc2608_insert on public.meal_participants_vc2608
  for insert with check (
    exists (select 1 from public.meals_vc2608 m where m.id = meal_id and public.is_household_member_vc2608(m.household_id))
  );

create policy meal_participants_vc2608_delete on public.meal_participants_vc2608
  for delete using (
    exists (select 1 from public.meals_vc2608 m where m.id = meal_id and public.is_household_member_vc2608(m.household_id))
  );

-- meal_responses_vc2608: 회원 응답만 직접 RLS로 허용. 게스트 응답은 SECURITY DEFINER RPC로만 기록된다.
create policy meal_responses_vc2608_select on public.meal_responses_vc2608
  for select using (
    exists (select 1 from public.meals_vc2608 m where m.id = meal_id and public.is_household_member_vc2608(m.household_id))
  );

create policy meal_responses_vc2608_member_insert on public.meal_responses_vc2608
  for insert with check (
    is_guest = false
    and profile_id = auth.uid()
    and exists (select 1 from public.meals_vc2608 m where m.id = meal_id and public.is_household_member_vc2608(m.household_id))
  );

create policy meal_responses_vc2608_member_update on public.meal_responses_vc2608
  for update using (is_guest = false and profile_id = auth.uid());

-- meal_share_links_vc2608: 같은 가구 구성원이면 열람/발급/폐기 가능. 게스트는 RPC로만 접근.
create policy meal_share_links_vc2608_manage on public.meal_share_links_vc2608
  for all using (
    exists (select 1 from public.meals_vc2608 m where m.id = meal_id and public.is_household_member_vc2608(m.household_id))
  )
  with check (
    exists (select 1 from public.meals_vc2608 m where m.id = meal_id and public.is_household_member_vc2608(m.household_id))
  );

-- menu_requests_vc2608
create policy menu_requests_vc2608_select on public.menu_requests_vc2608
  for select using (public.is_household_member_vc2608(household_id));

create policy menu_requests_vc2608_insert on public.menu_requests_vc2608
  for insert with check (public.is_household_member_vc2608(household_id) and profile_id = auth.uid());

create policy menu_requests_vc2608_delete_own on public.menu_requests_vc2608
  for delete using (profile_id = auth.uid());

-- notifications_vc2608: 수신자만 조회/읽음 처리. 생성은 서버(service role)에서만 수행.
create policy notifications_vc2608_select_own on public.notifications_vc2608
  for select using (profile_id = auth.uid());

create policy notifications_vc2608_update_own on public.notifications_vc2608
  for update using (profile_id = auth.uid());
