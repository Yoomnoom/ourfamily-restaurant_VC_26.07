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

## Screen-specific notes (8-2. 식사 사진 기록)

- 참고문서 §16 로드맵 "2차: 음식 사진 기록"을 실제 목업으로 구현(사용자 스코프 확장 결정, 2026-08-16).
- **§0.5 철학 준수**: "재미를 위한 추가 입력·필수 사진을 밀어낸다" — 사진은 명확히 **선택**. `3-5. 오늘의 식탁 완성`에 "사진 남기기 (선택)" 보조 버튼으로만 진입, 기본 흐름(홈으로)을 막지 않음.
- 저장된 사진은 `localStorage['meal_photos']`(날짜를 키로)에 저장하고, `5-2. 식사 기록` 목록에서 썸네일로 노출.
- 아바타 크롭 모달(1-1/1-3/1-4)과 달리 원형 크롭이 필요 없어(음식 사진은 사각형) 단순 미리보기만 사용.
