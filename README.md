# 우리집식당

가족 식사에서 반복되는 질문과 인원 조율을 줄이는 서비스. Next.js App Router + Supabase(Postgres, Auth) + Vercel.

## 로컬 실행

```powershell
npm install
npm run dev       # http://localhost:3000
npm test          # node --test
npm run build     # 프로덕션 빌드
```

`.env.local`이 필요합니다 (`.env.example` 참고):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

값은 Supabase 대시보드 → Project Settings → API에서 복사합니다. `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이며 절대 커밋하지 않습니다.

## 이 Supabase 프로젝트에 대한 중요한 사실

이 프로젝트(`pkucszwwnwpzvzqczmhh`)는 다른 개인 프로젝트들과 **공유**됩니다. 그래서 이 앱이 만든 모든 테이블·함수·트리거 이름에는 `_vc2608` 접미사가 붙어 있습니다 (`profiles_vc2608`, `create_household_vc2608` 등). 새 마이그레이션을 추가할 때도 이 접미사 규칙을 반드시 지켜야 다른 프로젝트의 동일 이름 테이블/함수와 충돌하지 않습니다.

## DB 마이그레이션

`supabase/migrations/`에 순서대로 있습니다. Supabase MCP(`apply_migration`) 또는 Supabase 대시보드 SQL 에디터에서 순서대로 실행합니다.

- `0001_init.sql`: 전체 스키마(가구/역할/식사/응답/공유링크/알림) + RLS 정책 + RPC 함수
- `0002_lockdown_grants.sql`: 보안 어드바이저 경고 해소 (관리자 RPC의 `public`/`anon` 실행 권한 제거)

## 배포 (Vercel)

Vercel 프로젝트 `ourfamily-restaurant-vc-26-07` (팀 `yoomnoom`)에 GitHub `main` 브랜치가 연결되어 있습니다. 환경변수 3개(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)를 Vercel 프로젝트 설정(Production + Preview)에 등록해야 합니다 — **키만 만들어두고 값을 비워두면 모든 페이지가 500 에러**를 냅니다(과거에 겪은 실제 장애 원인).

배포 후 확인:

```
GET /            → 로그인 안 되어 있으면 클라이언트가 /login으로 이동
GET /login       → 200
GET /respond/:token → 200 (공개 경로)
GET /api/me      → 미인증 401, 인증 200
```

## 아키텍처 노트

- **인증**: 이메일 매직 링크만 지원 (`app/api/auth/magic-link`, `app/auth/callback`). 비밀번호 로그인 없음.
- **보호 경로**: Next.js 미들웨어(Edge 런타임)에서 `@supabase/ssr`을 호출하면 Vercel에서 항상 크래시하는 것을 확인해 미들웨어를 사용하지 않는다. 인증 리다이렉트는 클라이언트에서 처리(`/api/me`가 401이면 `/login`으로 이동)하고, 실제 데이터 보호는 모든 API 라우트의 `requireUser()` + DB의 Row Level Security가 담당한다.
- **비회원(게스트) 응답**: 공유 토큰은 원문이 아니라 SHA-256 해시로만 저장한다. 게스트는 `anon` 권한으로 실행되는 SECURITY DEFINER RPC 3개(`get_meal_by_share_token_vc2608`, `get_guest_response_vc2608`, `submit_guest_meal_response_vc2608`)를 통해서만 접근하며, 그 외 테이블에는 `anon` 권한이 전혀 부여되지 않는다.
- **가구 생성/초대**: `household_members_vc2608`에 대한 RLS는 이미 그 가구의 구성원만 조회/관리하게 막는다. 아직 구성원이 아닌 사용자가 가구를 만들거나 초대 코드로 참여하는 첫 삽입은 RLS로는 인가할 수 없어 SECURITY DEFINER RPC(`create_household_vc2608`, `redeem_household_invite_vc2608`)로 처리한다.

## 남은 작업 / 알려진 제한

- 달력의 월 이동(‹ ›)은 시각적 표시만 있고 동작하지 않음.
- 게스트 응답 요청 제한(`lib/rate-limit.ts`)은 서버리스 인스턴스 메모리 기반 — 콜드스타트마다 리셋됨.
- 냉장고 AI, 사진 기록, 식비 예산/정산, 실제 밀키트 결제, 푸시/SMS 알림은 이번 단계 범위 밖(`docs/planning/CODEX_PRODUCTION_HANDOFF.md` §12 참고).
