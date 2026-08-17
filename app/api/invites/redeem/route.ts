import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/supabase/api";
import { hashToken } from "../../../../lib/tokens";

export async function POST(request: Request) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) return NextResponse.json({ error: "code_required" }, { status: 400 });

  const { data, error } = await supabase.rpc("redeem_household_invite", { invite_code_hash: hashToken(code) });
  if (error) return NextResponse.json({ error: "invalid_or_expired_invite" }, { status: 400 });

  return NextResponse.json({ household: data });
}
