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

## Screen-specific notes (8-4. 정산)

- 참고문서 §16 로드맵 "4차: 공동 결제·분담·정산"을 실제 목업으로 구현(사용자 스코프 확장 결정, 2026-08-16). 로드맵 중 가장 마지막 단계 — §13 미결 질문7 "가족 돈 문제 관계 리스크"가 명시적으로 걸려있는 항목이라, **실제 결제·송금 연동은 하지 않고** 금액을 참여자 수만큼 균등 분담해서 각자 "정산 완료" 여부만 토글하는 수준으로 제한.
- `5-2. 식사 기록`에서 비용이 입력된 기록에만 "정산하기" 버튼이 뜸(`?date=`로 어느 기록인지 전달).
- 정산 완료 상태는 `localStorage['settlements'][dateKey]`에 참여자별로 저장.
