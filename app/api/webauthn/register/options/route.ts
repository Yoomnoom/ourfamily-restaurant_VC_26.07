import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { requireUser } from "../../../../../lib/supabase/api";
import { relyingParty, CHALLENGE_COOKIE_OPTIONS } from "../../../../../lib/webauthn";

export async function POST(request: Request) {
  const { supabase, user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;
  const { rpID } = relyingParty(request);

  const { data: profile } = await supabase.from("profiles_vc2608").select("name").eq("id", user.id).single();
  const { data: existing } = await supabase.from("webauthn_credentials_vc2608").select("credential_id");

  const options = await generateRegistrationOptions({
    rpName: "우리집식당",
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: user.email ?? user.id,
    userDisplayName: profile?.name ?? user.email ?? "",
    attestationType: "none",
    excludeCredentials: (existing ?? []).map((row) => ({ id: row.credential_id })),
    authenticatorSelection: { residentKey: "required", userVerification: "required" }
  });

  const response = NextResponse.json(options);
  response.cookies.set("webauthn_challenge", options.challenge, CHALLENGE_COOKIE_OPTIONS);
  return response;
}
