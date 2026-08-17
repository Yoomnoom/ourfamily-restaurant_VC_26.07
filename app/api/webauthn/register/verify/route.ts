import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { requireUser } from "../../../../../lib/supabase/api";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";
import { relyingParty, readChallengeCookie } from "../../../../../lib/webauthn";

export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { rpID, origin } = relyingParty(request);

  const challenge = readChallengeCookie(request);
  if (!challenge) return NextResponse.json({ error: "challenge_missing" }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    });
  } catch {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "not_verified" }, { status: 400 });
  }

  const { credential } = verification.registrationInfo;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("webauthn_credentials_vc2608").insert({
    profile_id: user.id,
    credential_id: credential.id,
    public_key: Buffer.from(credential.publicKey).toString("base64url"),
    counter: credential.counter
  });

  if (error) return NextResponse.json({ error: "save_failed" }, { status: 500 });

  const response = NextResponse.json({ success: true });
  response.cookies.delete("webauthn_challenge");
  return response;
}
