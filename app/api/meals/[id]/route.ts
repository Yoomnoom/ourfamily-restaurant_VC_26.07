import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/supabase/api";

const ALLOWED_FIELDS = ["date", "time", "kind", "menu", "note"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const body = await request.json().catch(() => null);
  const update: Record<string, string> = {};

  if (typeof body?.status === "string") {
    if (!["open", "confirmed", "cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "invalid_status" }, { status: 400 });
    }
    update.status = body.status;
  }

  for (const field of ALLOWED_FIELDS) {
    if (typeof body?.[field] === "string") update[field] = body[field];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const { data, error } = await supabase.from("meals").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "update_failed" }, { status: 400 });
  return NextResponse.json({ meal: data });
}
