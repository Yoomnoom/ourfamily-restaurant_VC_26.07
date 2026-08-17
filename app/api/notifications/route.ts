import { NextResponse } from "next/server";
import { requireUser } from "../../../lib/supabase/api";

export async function GET() {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabase.from("notifications_vc2608").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "load_failed" }, { status: 500 });
  return NextResponse.json({ notifications: data });
}

export async function PATCH(request: Request) {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);

  if (body?.all === true) {
    const { error } = await supabase.from("notifications_vc2608").update({ read: true }).eq("profile_id", user.id).eq("read", false);
    if (error) return NextResponse.json({ error: "update_failed" }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });

  const { error } = await supabase.from("notifications_vc2608").update({ read: true }).eq("id", id);
  if (error) return NextResponse.json({ error: "update_failed" }, { status: 400 });
  return NextResponse.json({ success: true });
}
