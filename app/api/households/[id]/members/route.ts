import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/supabase/api";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const { data, error } = await supabase
    .from("household_members_vc2608")
    .select("id, role, joined_at, profiles:profiles_vc2608(id, name)")
    .eq("household_id", id)
    .order("joined_at", { ascending: true });

  if (error) return NextResponse.json({ error: "load_failed" }, { status: 500 });
  return NextResponse.json({ members: data });
}
