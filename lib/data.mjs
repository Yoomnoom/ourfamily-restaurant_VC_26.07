// 브라우저에 남아있던 시제품 버전의 localStorage 키. 로그인 후 1회 가져오기 안내에 사용하고
// 실제 데이터 원본으로는 더 이상 쓰지 않는다.
export const LEGACY_STORAGE_KEY = "our-home-restaurant-v1";

export function mealSummary(meal) {
  const responses = meal.meal_responses ?? [];
  const attending = responses.filter((response) => response.status === "attending").length;
  const absent = responses.filter((response) => response.status === "absent").length;
  const memberResponseCount = responses.filter((response) => !response.is_guest).length;
  const participantCount = meal.meal_participants?.length ?? 0;
  return { attending, absent, pending: Math.max(0, participantCount - memberResponseCount) };
}
