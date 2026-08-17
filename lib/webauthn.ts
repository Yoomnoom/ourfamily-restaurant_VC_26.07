export function relyingParty(request: Request) {
  const url = new URL(request.url);
  return { rpID: url.hostname, origin: url.origin };
}

export function readChallengeCookie(request: Request) {
  const raw = request.headers.get("cookie")?.match(/webauthn_challenge=([^;]+)/)?.[1];
  return raw ? decodeURIComponent(raw) : null;
}

export const CHALLENGE_COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: "lax" as const, maxAge: 300, path: "/" };
