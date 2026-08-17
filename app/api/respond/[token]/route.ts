import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { hashToken } from "../../../../lib/tokens";
import { clientIp, isRateLimited } from "../../../../lib/rate-limit";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (isRateLimited(`respond-get:${clientIp(request)}`, 60, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_meal_by_share_token", { share_token_hash: hashToken(token) });

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "invalid_or_expired_link" }, { status: 404 });
  }

  return NextResponse.json({ meal: data[0] });
}
