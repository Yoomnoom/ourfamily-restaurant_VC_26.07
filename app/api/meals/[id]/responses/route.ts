import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/supabase/api";
import { notifyHousehold } from "../../../../../lib/notify";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const { data, error } = await supabase.from("meal_responses").select("*").eq("meal_id", id);
  if (error) return NextResponse.json({ error: "load_failed" }, { status: 500 });
  return NextResponse.json({ responses: data });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const body = await request.json().catch(() => null);
  const status = body?.status;
  const arrivalTime = typeof body?.arrivalTime === "string" && body.arrivalTime ? body.arrivalTime : null;

  if (status !== "attending" && status !== "absent") {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("meal_responses")
    .upsert(
      { meal_id: id, profile_id: user.id, is_guest: false, status, arrival_time: arrivalTime },
      { onConflict: "meal_id,profile_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: "respond_failed" }, { status: 400 });

  const [{ data: meal }, { data: profile }] = await Promise.all([
    supabase.from("meals").select("household_id, menu").eq("id", id).single(),
    supabase.from("profiles").select("name").eq("id", user.id).single()
  ]);

  if (meal) {
    const statusText = status === "attending" ? "먹어요" : "안 먹어요";
    await notifyHousehold(meal.household_id, `${profile?.name ?? "가족"} 님이 응답을 바꿨어요`, `${meal.menu} · ${statusText}`, {
      mealId: id,
      excludeProfileId: user.id
    });
  }

  return NextResponse.json({ response: data });
}
