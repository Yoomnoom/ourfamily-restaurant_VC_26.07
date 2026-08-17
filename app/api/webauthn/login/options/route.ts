import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { relyingParty, CHALLENGE_COOKIE_OPTIONS } from "../../../../../lib/webauthn";
import { clientIp, isRateLimited } from "../../../../../lib/rate-limit";

export async function POST(request: Request) {
  if (isRateLimited(`webauthn-options:${clientIp(request)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { rpID } = relyingParty(request);
  const options = await generateAuthenticationOptions({ rpID, userVerification: "required" });

  const response = NextResponse.json(options);
  response.cookies.set("webauthn_challenge", options.challenge, CHALLENGE_COOKIE_OPTIONS);
  return response;
}
