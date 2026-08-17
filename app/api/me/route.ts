import { NextResponse } from "next/server";
import { requireUser } from "../../../lib/supabase/api";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

export async function GET() {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  let { data: profile } = await supabase.from("profiles_vc2608").select("id, name").eq("id", user.id).single();

  // 이 Supabase 프로젝트는 여러 앱이 공유한다. 다른 앱에서 이미 가입된 이메일로 로그인하면
  // auth.users에 새 INSERT가 없어 신규가입 트리거(on_auth_user_created_vc2608)가 돌지 않는다.
  // 그런 경우 프로필이 비어있는 채로 남으므로 여기서 한 번 만들어준다.
  if (!profile) {
    const admin = createSupabaseAdminClient();
    const fallbackName = (user.user_metadata as { name?: string } | null)?.name || user.email?.split("@")[0] || "회원";
    const { data: created } = await admin
      .from("profiles_vc2608")
      .upsert({ id: user.id, name: fallbackName }, { onConflict: "id" })
      .select("id, name")
      .single();
    profile = created ?? null;
  }

  const { data: memberships } = await supabase
    .from("household_members_vc2608")
    .select("role, households:households_vc2608(id, name, owner_id)")
    .eq("profile_id", user.id);

  return NextResponse.json({
    profile: profile ? { ...profile, email: user.email } : null,
    households: (memberships ?? []).map((row) => ({ ...row.households, role: row.role }))
  });
}
