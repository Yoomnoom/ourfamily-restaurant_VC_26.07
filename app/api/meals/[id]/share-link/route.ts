import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/supabase/api";
import { generateToken, hashToken } from "../../../../../lib/tokens";

// 평문 토큰은 발급 시 응답으로만 노출한다. DB에는 해시만 저장되어 있어 이후 조회로는 되돌릴 수 없다.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const { data, error } = await supabase
    .from("meal_share_links")
    .select("id, created_at, expires_at")
    .eq("meal_id", id)
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "load_failed" }, { status: 500 });
  return NextResponse.json({ active: Boolean(data), createdAt: data?.created_at ?? null });
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  await supabase.from("meal_share_links").update({ revoked_at: new Date().toISOString() }).eq("meal_id", id).is("revoked_at", null);

  const token = generateToken();
  const { error } = await supabase
    .from("meal_share_links")
    .insert({ meal_id: id, token_hash: hashToken(token), created_by: user.id });

  if (error) return NextResponse.json({ error: "create_failed" }, { status: 400 });
  return NextResponse.json({ token, path: `/respond/${token}` });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const { error } = await supabase
    .from("meal_share_links")
    .update({ revoked_at: new Date().toISOString() })
    .eq("meal_id", id)
    .is("revoked_at", null);

  if (error) return NextResponse.json({ error: "revoke_failed" }, { status: 400 });
  return NextResponse.json({ success: true });
}
