import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { relyingParty, readChallengeCookie } from "../../../../../lib/webauthn";
import { clientIp, isRateLimited } from "../../../../../lib/rate-limit";

export async function POST(request: Request) {
  if (isRateLimited(`webauthn-login:${clientIp(request)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { rpID, origin } = relyingParty(request);
  const challenge = readChallengeCookie(request);
  if (!challenge) return NextResponse.json({ error: "challenge_missing" }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data: stored } = await admin.from("webauthn_credentials_vc2608").select("*").eq("credential_id", body.id).maybeSingle();
  if (!stored) return NextResponse.json({ error: "unknown_credential" }, { status: 400 });

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: stored.credential_id,
        publicKey: Buffer.from(stored.public_key, "base64url"),
        counter: Number(stored.counter)
      }
    });
  } catch {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }

  if (!verification.verified) return NextResponse.json({ error: "not_verified" }, { status: 400 });

  await admin
    .from("webauthn_credentials_vc2608")
    .update({ counter: verification.authenticationInfo.newCounter, last_used_at: new Date().toISOString() })
    .eq("credential_id", body.id);

  const { data: authUser } = await admin.auth.admin.getUserById(stored.profile_id);
  const email = authUser?.user?.email;
  if (!email) return NextResponse.json({ error: "user_not_found" }, { status: 400 });

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const hashedToken = linkData?.properties?.hashed_token;
  if (linkError || !hashedToken) return NextResponse.json({ error: "session_failed" }, { status: 500 });

  const supabase = await createSupabaseServerClient();
  const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: hashedToken });
  if (verifyError || !verifyData.session) return NextResponse.json({ error: "session_failed" }, { status: 500 });

  const response = NextResponse.json({ success: true });
  response.cookies.delete("webauthn_challenge");
  return response;
}
