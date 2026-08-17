-- authenticated 롤에 필요한 테이블 단위 권한을 명시적으로 부여한다.
-- RLS 정책은 "어떤 행"을 볼 수 있는지만 제한하고, "테이블 자체에 접근 가능한지"는
-- 별도의 GRANT가 있어야 한다. 이 프로젝트는 기본 권한 자동 부여가 다른 프로젝트들과
-- 달라서 authenticated에 아무 grant도 없었다.

grant select, update on public.profiles_vc2608 to authenticated;
grant select, update, delete on public.households_vc2608 to authenticated;
grant select, update, delete on public.household_members_vc2608 to authenticated;
grant select on public.household_invites_vc2608 to authenticated;
grant select, insert, update on public.meals_vc2608 to authenticated;
grant select, insert, delete on public.meal_participants_vc2608 to authenticated;
grant select, insert, update on public.meal_responses_vc2608 to authenticated;
grant select, insert, update on public.meal_share_links_vc2608 to authenticated;
grant select, insert, delete on public.menu_requests_vc2608 to authenticated;
grant select, update on public.notifications_vc2608 to authenticated;

-- service_role(서버 전용, RLS 우회)도 이 프로젝트에서는 기본 전체 권한이 없을 수 있으니
-- notifications 발송과 게스트 응답 처리에 필요한 권한을 명시적으로 보장한다.
grant select, insert, update, delete on
  public.profiles_vc2608,
  public.households_vc2608,
  public.household_members_vc2608,
  public.household_invites_vc2608,
  public.meals_vc2608,
  public.meal_participants_vc2608,
  public.meal_responses_vc2608,
  public.meal_share_links_vc2608,
  public.menu_requests_vc2608,
  public.notifications_vc2608
to service_role;
