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
  error: '#ba1a1a'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
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

## Screen-specific notes (7-1. 우리집 냉장고)

- 사용자가 별도로 만든 개인용 앱 "AYoom"(냉장고 사진 인식 → 레시피 추천)의 핵심 기능을 우리집식당에 접목한 것. AYoom은 **1인용** 냉장고 관리 앱이지만, 여기서는 **가구 단위 공유 재고**로 스코프를 좁혀 참고문서의 "가구·구성원" 층(§6.1)과 맞춤.
- AYoom "마이" 탭의 "오늘의 냉장고 상태"(신선한 재료/곧 소비할 재료/오늘 먹어야 할 재료) 패턴을 그대로 가져와 홈 화면으로 승격.
- FAB(+)로 `7-2. 재료 사진 분석`에서 새 재료를 추가. 여기서 추가된 재료가 `3-2. 식사 만들기` → `7-3. 메뉴 추천`의 매치율 계산에 쓰임.
- 참고문서엔 냉장고 재고 개념이 없어(§13 미결 아님, 완전히 새 기능) 통계(§2 대원칙)에 바로 연결하지 않음 — 나중에 "이번 주 절약 효과"(AYoom 마이 탭에 있던 것)를 만들고 싶어지면 그때 §2 대원칙에 맞춰 확장.
