---
name: Warm Table
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#45474a'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#76777b'
  outline-variant: '#c6c6ca'
  surface-tint: '#5d5e62'
  primary: '#5d5e62'
  on-primary: '#ffffff'
  primary-container: '#f5f5f9'
  on-primary-container: '#6f7074'
  inverse-primary: '#c6c6ca'
  secondary: '#5e5e5f'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e3'
  on-secondary-container: '#646465'
  tertiary: '#645d55'
  on-tertiary: '#ffffff'
  tertiary-container: '#fef4e9'
  on-tertiary-container: '#766f66'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e6'
  primary-fixed-dim: '#c6c6ca'
  on-primary-fixed: '#1a1c1f'
  on-primary-fixed-variant: '#45474a'
  secondary-fixed: '#e3e2e3'
  secondary-fixed-dim: '#c7c6c7'
  on-secondary-fixed: '#1b1c1d'
  on-secondary-fixed-variant: '#464748'
  tertiary-fixed: '#ebe1d6'
  tertiary-fixed-dim: '#cec5bb'
  on-tertiary-fixed: '#1f1b15'
  on-tertiary-fixed-variant: '#4b463e'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
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
    letterSpacing: 0.02em
  emotional-quote:
    fontFamily: Noto Serif
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  card-padding: 1.25rem
  stack-gap: 1rem
  section-margin: 2rem
  safe-area-inset: 1rem
---

## Brand & Style
"Information-First, Emotion-Framed." Stone-hued neutral background, white functional cards, peach used only for emotional/completion states. Noto Serif for emotional copy, Plus Jakarta Sans for functional UI.

## Screen-specific notes (3-4. 확정 전 요약)

- 참고문서 화면05 스펙: 강조박스(예상 준비/확인 안 됨) → 함께 먹어요/늦게 와요/확인 안 됨 3그룹 분리 → 참여자 메모 → 최종 인원 직접 조정(+/-) → "오늘의 식탁 확정하기" 버튼 + 미응답 있어도 확정 가능 안내(경고 아닌 확인 단계).
- 예상 준비 인원 계산 규칙(§10): attending(함께 먹어요 + 늦게 와요) 대상만 포함, pending(확인 안 됨)·absent 제외. 이 화면에서 개설자가 최종 인원을 스테퍼로 직접 조정할 수 있게 함(회의 좌석 준비 오차 대비).
- 확정 버튼 클릭 시 `3-5. 오늘의 식탁 완성`으로 이동.
