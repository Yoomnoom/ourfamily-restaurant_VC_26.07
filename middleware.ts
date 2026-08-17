import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const response = NextResponse.next();
  response.headers.set("x-diag-url-present", url ? "yes" : "no");
  response.headers.set("x-diag-key-present", key ? "yes" : "no");

  try {
    const supabase = createServerClient(url || "", key || "", {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {}
      }
    });
    response.headers.set("x-diag-client-created", "yes");
    const { error } = await supabase.auth.getUser();
    response.headers.set("x-diag-getuser-error", error ? error.message : "none");
  } catch (e) {
    response.headers.set("x-diag-exception", String((e as Error)?.message ?? e).slice(0, 200));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"]
};
