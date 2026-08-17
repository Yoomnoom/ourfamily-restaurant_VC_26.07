---
name: Warm Table
colors:
  surface: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  on-surface: '#1b1c1c'
  on-surface-variant: '#45474a'
  outline: '#76777b'
  outline-variant: '#c6c6ca'
  primary: '#5d5e62'
  on-primary: '#ffffff'
typography:
  display-serif:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
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

## Screen-specific notes (4-1. 홈 달력뷰)

- 참고문서 화면08 스펙: 월/주/오늘 탭 + ‹ › 날짜 이동, 오늘은 강조 표시, 식사 있는 날은 대표 메뉴+만든 사람 색점, 여러 식사면 "외 N건". **집밥/외식/배달 종류는 달력에 표시하지 않는다**(§10 근거: 색점은 만든 사람 전용, 종류 색과 충돌 방지).
- Warm Table 팔레트에는 PRD 원안의 "오늘=파란 테두리" 같은 파랑 토큰이 없어, 오늘 강조는 `ring-2 ring-primary`(슬레이트 그레이)로 대체 — 새 색을 추가하지 않고 기존 팔레트 안에서 표현.
- 3-1(카드 목록)과 이 화면은 **같은 홈의 두 가지 보기**(참고문서 §10: 화면03=카드 목록, 화면08=달력)이므로 하단 탭 대신 헤더의 목록/달력 토글로 전환. 3-1에도 동일한 토글을 추가해 상호 연결.
- 날짜 칸을 누르면 `4-2. 그날 상세`로 이동(하루 여러 식사 지원).
- 정적 목업이라 달력 그리드는 2024년 8월을 하드코딩. 실제 구현 시엔 날짜 계산 로직으로 대체.
