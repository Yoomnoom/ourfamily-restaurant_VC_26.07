import { NextResponse } from "next/server";
import { requireUser } from "../../../lib/supabase/api";

export async function GET() {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles_vc2608").select("id, name").eq("id", user.id).single(),
    supabase.from("household_members_vc2608").select("role, households:households_vc2608(id, name, owner_id)").eq("profile_id", user.id)
  ]);

  return NextResponse.json({
    profile: profile ? { ...profile, email: user.email } : null,
    households: (memberships ?? []).map((row) => ({ ...row.households, role: row.role }))
  });
}
