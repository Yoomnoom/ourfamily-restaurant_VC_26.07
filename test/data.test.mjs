import test from "node:test";
import assert from "node:assert/strict";
import { mealSummary } from "../lib/data.mjs";
import { generateToken, hashToken } from "../lib/tokens.ts";
import { isRateLimited } from "../lib/rate-limit.ts";

test("응답 수정과 미응답 집계를 한 곳에서 처리한다", () => {
  const meal = {
    meal_participants: [{ profile_id: "m1" }, { profile_id: "m2" }, { profile_id: "m3" }, { profile_id: "m4" }],
    meal_responses: [
      { profile_id: "m1", is_guest: false, status: "attending" },
      { profile_id: "m2", is_guest: false, status: "attending" }
    ]
  };
  assert.deepEqual(mealSummary(meal), { attending: 2, absent: 0, pending: 2 });

  meal.meal_responses.push({ profile_id: "m3", is_guest: false, status: "absent" });
  assert.deepEqual(mealSummary(meal), { attending: 2, absent: 1, pending: 1 });
});

test("게스트 응답은 미응답 집계에서 참여자 수를 줄이지 않는다", () => {
  const meal = {
    meal_participants: [{ profile_id: "m1" }],
    meal_responses: [{ profile_id: null, guest_token: "g1", is_guest: true, status: "attending" }]
  };
  assert.deepEqual(mealSummary(meal), { attending: 1, absent: 0, pending: 1 });
});

test("공유 토큰 해시는 같은 입력에 항상 같은 값을 낸다", () => {
  const token = generateToken();
  assert.equal(hashToken(token), hashToken(token));
  assert.notEqual(hashToken(token), hashToken(generateToken()));
});

test("요청 제한은 한도를 넘기면 이후 요청을 막는다", () => {
  const key = `test-${Math.random()}`;
  for (let i = 0; i < 3; i += 1) assert.equal(isRateLimited(key, 3, 60000), false);
  assert.equal(isRateLimited(key, 3, 60000), true);
});
