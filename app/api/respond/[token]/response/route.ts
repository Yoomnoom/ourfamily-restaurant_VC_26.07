import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";
import { hashToken } from "../../../../../lib/tokens";
import { clientIp, isRateLimited } from "../../../../../lib/rate-limit";
import { notifyHousehold } from "../../../../../lib/notify";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const guestToken = new URL(request.url).searchParams.get("guestToken");
  if (!guestToken) return NextResponse.json({ response: null });

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("get_guest_response_vc2608", {
    share_token_hash: hashToken(token),
    guest_token_value: guestToken
  });

  return NextResponse.json({ response: data ?? null });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (isRateLimited(`respond-post:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const guestToken = typeof body?.guestToken === "string" ? body.guestToken : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const status = body?.status;
  const arrivalTime = typeof body?.arrivalTime === "string" && body.arrivalTime ? body.arrivalTime : null;

  if (!guestToken || !name || (status !== "attending" && status !== "absent")) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("submit_guest_meal_response_vc2608", {
    share_token_hash: hashToken(token),
    guest_token_value: guestToken,
    guest_display_name: name,
    response_status: status,
    response_arrival_time: arrivalTime
  });

  if (error) return NextResponse.json({ error: "invalid_or_expired_link" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data: meal } = await admin.from("meals_vc2608").select("household_id, menu").eq("id", data.meal_id).single();
  if (meal) {
    const statusText = status === "attending" ? "먹어요" : "안 먹어요";
    await notifyHousehold(meal.household_id, `${name} 님이 응답했어요`, `${meal.menu} · ${statusText}`, { mealId: data.meal_id });
  }

  return NextResponse.json({ response: data });
}
