import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/supabase/api";
import { generateToken, hashToken } from "../../../../../lib/tokens";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const code = generateToken();
  const { error } = await supabase.rpc("create_household_invite_vc2608", {
    target_household: id,
    code_hash: hashToken(code)
  });

  if (error) return NextResponse.json({ error: "invite_failed" }, { status: 400 });
  // 평문 코드는 이 응답에서만 노출한다. DB에는 해시만 저장된다.
  return NextResponse.json({ code });
}
