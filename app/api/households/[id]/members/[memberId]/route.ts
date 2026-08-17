import { NextResponse } from "next/server";
import { requireUser } from "../../../../../../lib/supabase/api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; memberId: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { memberId } = await params;

  const body = await request.json().catch(() => null);
  const role = body?.role;
  if (role !== "co-admin" && role !== "member") {
    // owner 위임은 /api/households/[id]/transfer-owner 에서만 처리한다.
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }

  const { error } = await supabase.from("household_members").update({ role }).eq("id", memberId);
  if (error) return NextResponse.json({ error: "update_failed" }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; memberId: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { memberId } = await params;

  const { error } = await supabase.from("household_members").delete().eq("id", memberId);
  if (error) return NextResponse.json({ error: "remove_failed" }, { status: 400 });
  return NextResponse.json({ success: true });
}
