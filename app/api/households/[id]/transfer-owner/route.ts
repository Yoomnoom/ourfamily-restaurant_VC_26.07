import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/supabase/api";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const body = await request.json().catch(() => null);
  const newOwnerProfileId = typeof body?.profileId === "string" ? body.profileId : "";
  if (!newOwnerProfileId) return NextResponse.json({ error: "profile_id_required" }, { status: 400 });

  const { data, error } = await supabase.rpc("transfer_household_owner", {
    target_household: id,
    new_owner_profile: newOwnerProfileId
  });

  if (error) return NextResponse.json({ error: "transfer_failed" }, { status: 400 });
  return NextResponse.json({ household: data });
}
