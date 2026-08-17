import { NextResponse } from "next/server";
import { requireUser } from "../../../lib/supabase/api";

export async function GET() {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabase
    .from("household_members")
    .select("role, households(id, name, owner_id)")
    .eq("profile_id", user.id);

  if (error) return NextResponse.json({ error: "load_failed" }, { status: 500 });

  const households = data.map((row) => ({ ...row.households, role: row.role }));
  return NextResponse.json({ households });
}

export async function POST(request: Request) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });

  const { data, error } = await supabase.rpc("create_household", { household_name: name });
  if (error) return NextResponse.json({ error: "create_failed" }, { status: 500 });

  return NextResponse.json({ household: data });
}
