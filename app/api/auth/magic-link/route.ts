import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const next = typeof body?.next === "string" && body.next.startsWith("/") ? body.next : "/";

  if (!email) {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const origin = new URL(request.url).origin;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` }
  });

  if (error) {
    return NextResponse.json({ error: "로그인 링크를 보내지 못했어요. 잠시 후 다시 시도해주세요." }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
