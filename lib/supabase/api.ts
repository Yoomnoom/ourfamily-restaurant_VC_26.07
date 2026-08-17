import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./server";

// proxy.ts가 이미 미인증 요청을 401로 막지만, 라우트 핸들러가 곧바로 user.id를 써야 하므로
// 여기서도 확인한다. 프록시 없이 직접 호출되는 경로가 생겨도 안전하게 막힌다.
export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { supabase, user: null, unauthorized: NextResponse.json({ error: "not_authenticated" }, { status: 401 }) };
  }
  return { supabase, user: data.user, unauthorized: null };
}
