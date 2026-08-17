---
name: Warm Table
colors:
  surface: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container: '#f0eded'
  on-surface: '#1b1c1c'
  on-surface-variant: '#45474a'
  outline-variant: '#c6c6ca'
  primary: '#5d5e62'
  on-primary: '#ffffff'
  tertiary-container: '#fef4e9'
  on-tertiary-container: '#766f66'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
---

## Screen-specific notes (7-3. 메뉴 추천)

- AYoom의 "레시피" 탭(보유재료 매치율 기반 추천 카드)을 참고문서 §5.1 "메뉴가 응답의 이유가 된다" · §15 Could "메뉴 추천 칩"에 맞춰 접목.
- 매치율은 `localStorage['household_fridge']`(`7-1`)의 실제 재료 목록과 하드코딩된 레시피 4종의 필요 재료를 교집합으로 **그 자리에서 계산**(AYoom처럼 고정 숫자를 미리 박아두지 않음).
- `3-2. 식사 만들기`의 "냉장고 재료로 추천받기"에서 진입. 레시피를 고르면 `localStorage['recipe_pick']`에 저장하고 `3-2`로 돌아가 대표 메뉴로 자동 반영.
- 원본 AYoom엔 있던 "저장한 레시피"·"이번 주 절약 효과" 등 개인 통계 기능은 가져오지 않음 — 우리집식당은 가구 단위 식사 조율이 핵심이라, 개인 절약 통계까지 확장하면 참고문서 §1.2 정체성과 멀어짐(사용자 확인 필요 시 별도 논의).
