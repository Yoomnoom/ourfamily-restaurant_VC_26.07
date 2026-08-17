import { createSupabaseAdminClient } from "./supabase/admin";

// notifications 테이블은 수신자만 select/update할 수 있고 insert 정책이 없다.
// 다른 구성원에게 알림을 만들어주는 건 항상 서버 로직이 서비스 롤 클라이언트로 대신 써준다.
export async function notifyHousehold(
  householdId: string,
  text: string,
  detail: string,
  options: { mealId?: string; excludeProfileId?: string } = {}
) {
  const admin = createSupabaseAdminClient();
  const { data: members } = await admin.from("household_members_vc2608").select("profile_id").eq("household_id", householdId);
  const recipients = (members ?? []).filter((member) => member.profile_id !== options.excludeProfileId);
  if (recipients.length === 0) return;

  await admin.from("notifications_vc2608").insert(
    recipients.map((member) => ({
      household_id: householdId,
      profile_id: member.profile_id,
      meal_id: options.mealId ?? null,
      text,
      detail
    }))
  );
}
