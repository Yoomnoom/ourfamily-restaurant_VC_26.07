---
name: Warm Table
colors:
  surface: '#fbf9f8'
  tertiary-container: '#fef4e9'
  on-tertiary-container: '#766f66'
  tertiary: '#645d55'
  on-surface: '#1b1c1c'
  on-surface-variant: '#45474a'
  primary: '#5d5e62'
  on-primary: '#ffffff'
  surface-container-lowest: '#ffffff'
  outline-variant: '#c6c6ca'
typography:
  emotional-quote:
    fontFamily: Noto Serif
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  display-serif:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
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

## Screen-specific notes (3-5. 오늘의 식탁 완성)

- 참고문서 화면06 스펙: **디자인 시스템 전체에서 유일하게** 오일파스텔 감성 톤(크림/피치 배경 + 손글씨 느낌 세리프)을 쓰는 화면. 다른 모든 화면의 Stone Grey 배경과 의도적으로 다름.
- "작업 완료"가 아니라 "오늘의 식탁이 완성됐어요" — 제품 철학(§0.5) 그대로. 과한 애니메이션 없이 정보(메뉴·시간·참여 요약) 전달이 우선.
- 이전 화면(3-4 확정 전 요약)에서 저장한 `localStorage['confirmed_meal']`을 읽어 실제 확정 인원/메뉴/메모를 반영.
