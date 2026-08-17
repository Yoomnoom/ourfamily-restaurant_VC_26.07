const buckets = new Map<string, { count: number; resetAt: number }>();

// ponytail: 서버리스 인스턴스 단위 메모리 제한이라 콜드스타트마다 리셋된다.
// 요청량이 실제로 문제되면 Upstash 같은 공유 저장소 기반 리미터로 올린다.
export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}
