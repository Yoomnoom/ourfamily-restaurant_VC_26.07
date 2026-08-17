import "server-only";
import { createClient } from "@supabase/supabase-js";

// 서비스 역할 키를 쓰는 클라이언트. 게스트 응답 검증, 알림 발송처럼 RLS를 우회해야 하는
// 좁은 서버 라우트에서만 사용한다. 브라우저 번들에 포함되면 안 되므로 "server-only"로 막는다.
export function createSupabaseAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
