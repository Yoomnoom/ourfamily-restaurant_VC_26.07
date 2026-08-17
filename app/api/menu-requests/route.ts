import { NextResponse } from "next/server";
import { requireUser } from "../../../lib/supabase/api";

export async function GET(request: Request) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const householdId = new URL(request.url).searchParams.get("householdId");
  if (!householdId) return NextResponse.json({ error: "household_id_required" }, { status: 400 });

  const { data, error } = await supabase
    .from("menu_requests_vc2608")
    .select("id, menu, created_at, profiles:profiles_vc2608(id, name)")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "load_failed" }, { status: 500 });
  return NextResponse.json({ menuRequests: data });
}

export async function POST(request: Request) {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const householdId = typeof body?.householdId === "string" ? body.householdId : "";
  const menu = typeof body?.menu === "string" ? body.menu.trim() : "";
  if (!householdId || !menu) return NextResponse.json({ error: "missing_fields" }, { status: 400 });

  const { data, error } = await supabase
    .from("menu_requests_vc2608")
    .insert({ household_id: householdId, profile_id: user.id, menu })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "create_failed" }, { status: 400 });
  return NextResponse.json({ menuRequest: data });
}

export async function DELETE(request: Request) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });

  const { error } = await supabase.from("menu_requests_vc2608").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "delete_failed" }, { status: 400 });
  return NextResponse.json({ success: true });
}
