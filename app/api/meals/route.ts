import { NextResponse } from "next/server";
import { requireUser } from "../../../lib/supabase/api";
import { notifyHousehold } from "../../../lib/notify";

export async function GET(request: Request) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const householdId = new URL(request.url).searchParams.get("householdId");
  if (!householdId) return NextResponse.json({ error: "household_id_required" }, { status: 400 });

  const { data, error } = await supabase
    .from("meals_vc2608")
    .select("*, meal_participants:meal_participants_vc2608(profile_id), meal_responses:meal_responses_vc2608(id, profile_id, guest_name, is_guest, status, arrival_time)")
    .eq("household_id", householdId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) return NextResponse.json({ error: "load_failed" }, { status: 500 });
  return NextResponse.json({ meals: data });
}

export async function POST(request: Request) {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const householdId = typeof body?.householdId === "string" ? body.householdId : "";
  const date = typeof body?.date === "string" ? body.date : "";
  const time = typeof body?.time === "string" ? body.time : "";
  const menu = typeof body?.menu === "string" ? body.menu.trim() : "";
  const kind = typeof body?.kind === "string" ? body.kind : "집밥";
  const note = typeof body?.note === "string" ? body.note : "";

  if (!householdId || !date || !time || !menu) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { data: members, error: membersError } = await supabase
    .from("household_members_vc2608")
    .select("profile_id")
    .eq("household_id", householdId);

  if (membersError) return NextResponse.json({ error: "load_failed" }, { status: 500 });

  const { data: meal, error: mealError } = await supabase
    .from("meals_vc2608")
    .insert({ household_id: householdId, creator_id: user.id, date, time, kind, menu, note })
    .select()
    .single();

  if (mealError) return NextResponse.json({ error: "create_failed" }, { status: 400 });

  if (members && members.length > 0) {
    await supabase.from("meal_participants_vc2608").insert(members.map((member) => ({ meal_id: meal.id, profile_id: member.profile_id })));
  }

  await notifyHousehold(householdId, `${menu} 식사가 열렸어요`, `${date} · ${time}`, { mealId: meal.id, excludeProfileId: user.id });

  return NextResponse.json({ meal });
}
