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
  emotional-quote:
    fontFamily: Noto Serif
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
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

## Screen-specific notes (8-1. 밀키트 주문)

- **사용자가 명시적으로 스코프 확장을 요청**(2026-08-16)해서 만든 화면. 참고문서 §16 로드맵 "1차: 밀키트 제휴"를 실제 목업으로 구현 — 이전까진 "준비 중" 텍스트였음.
- 진입 경로 2곳: `7-3. 메뉴 추천`(재료 부족한 레시피에서, `localStorage['milkit_order']`로 구체적 재료 전달) / `3-1. 홈-카드목록`(패턴 기반 배너, 데이터 없이 일반 진입 — 기본 예시로 표시).
- 실제 결제·배송 연동은 없음(정적 목업). "주문하기"는 로컬 상태만 바꾸고 완료 화면을 보여줌.
