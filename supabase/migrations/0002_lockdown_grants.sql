-- 트리거 전용 함수는 REST RPC로 직접 호출될 필요가 없다. public(익명 포함) 실행 권한을 제거한다.
-- 트리거 발동 자체는 EXECUTE 권한 확인 대상이 아니라 영향받지 않는다.
revoke execute on function public.set_updated_at_vc2608() from public;
revoke execute on function public.guard_household_owner_change_vc2608() from public;
revoke execute on function public.handle_new_user_vc2608() from public;

-- 회원 전용 RPC: authenticated에게만 실행 권한을 남기고 public(익명 포함) 권한은 제거한다.
revoke execute on function public.create_household_vc2608(text) from public;
grant execute on function public.create_household_vc2608(text) to authenticated;

revoke execute on function public.create_household_invite_vc2608(uuid, text, timestamptz) from public;
grant execute on function public.create_household_invite_vc2608(uuid, text, timestamptz) to authenticated;

revoke execute on function public.redeem_household_invite_vc2608(text) from public;
grant execute on function public.redeem_household_invite_vc2608(text) to authenticated;

revoke execute on function public.transfer_household_owner_vc2608(uuid, uuid) from public;
grant execute on function public.transfer_household_owner_vc2608(uuid, uuid) to authenticated;

revoke execute on function public.is_household_member_vc2608(uuid) from public;
grant execute on function public.is_household_member_vc2608(uuid) to authenticated;

revoke execute on function public.is_household_admin_vc2608(uuid) from public;
grant execute on function public.is_household_admin_vc2608(uuid) to authenticated;

-- set_updated_at_vc2608에도 search_path를 고정해 mutable search_path 경고를 해소한다.
create or replace function public.set_updated_at_vc2608()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke execute on function public.set_updated_at_vc2608() from public;

-- 게스트 응답 RPC 3개는 비로그인(anon) 호출이 의도된 설계이므로 그대로 둔다:
-- get_meal_by_share_token_vc2608, get_guest_response_vc2608, submit_guest_meal_response_vc2608
