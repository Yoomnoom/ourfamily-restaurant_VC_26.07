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

## Screen-specific notes (5-2. 식사 기록)

- 참고문서 §15 Must "최소 재사용(이 구성으로 새 식사)"과 §8.1 "기록 → 재사용" 루프를 근거로 제작. §10엔 번호가 없지만 §12 `meal_records` 데이터에 대응하는 화면.
- "이 구성으로 새 식사 만들기" 클릭 시 `localStorage['reuse_meal']`에 메뉴·참여자를 저장하고 `3-2. 식사 만들기`로 이동 — `3-2`는 이 키가 있으면 기본값 대신 그 내용을 미리 채운다(고급 검색·필터는 Could 항목이라 만들지 않음, ponytail).
