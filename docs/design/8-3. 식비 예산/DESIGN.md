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
  error: '#ba1a1a'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  display-serif:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
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

## Screen-specific notes (8-3. 식비 예산)

- 참고문서 §16 로드맵 "3차: 식사별 금액·월 식비 예산"을 실제 목업으로 구현(사용자 스코프 확장 결정, 2026-08-16).
- `5-2. 식사 기록`에서 각 기록에 입력한 `localStorage['meal_costs']`를 합산해 이번 달 총 지출을 계산. 월 예산은 이 화면에서 직접 설정(`localStorage['monthly_budget']`).
- `4-3. 월 요약 통계`에서 진입. §13 미결 질문7(식비 확장 시 공개 범위 기본값)은 아직 미확정이라, 가구 전체 합산 금액만 보여주고 "누가 얼마 썼는지" 개인별 분리는 하지 않음(그건 4차 정산 단계에서 다룸).
