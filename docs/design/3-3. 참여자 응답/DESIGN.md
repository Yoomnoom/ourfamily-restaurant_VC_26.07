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

The design system is centered on the concept of **"Information-First, Emotion-Framed."** It aims to transform domestic meal coordination from a chore into a gesture of care.

The visual style blends **Minimalism** and **Tactile/Soft design**: neutral stone-hued background, large "wave-shaped" cards, muted peach accents.

## Colors

- **Stone Grey** canvas, **White** functional cards, **Peach** emotional backgrounds.
- **Status Colors** (Muted Gold, Slate, Grey): Gold = immediate focus, Slate = upcoming, Grey = neutral/inactive.
- **Identity Dots**: muted named colors, identity only, never status.

## Typography

- **Serif (Noto Serif)**: emotional/personalized layers (greetings, completion messages).
- **Sans-Serif (Plus Jakarta Sans)**: all functional UI (buttons, labels, lists).

## Layout & Spacing

- **One-Hand Zone**: primary response actions live in the bottom 40% of the screen.
- Single-column, `max-width: 600px` centered container.
- `1rem` safe-area horizontal margin.

## Shapes & Components

- Cards: `rounded-lg` (1rem), white on stone background, subtle low-opacity shadow instead of hard shadow.
- Buttons/chips: `rounded-xl` or full pill, "squishy" tap targets.
- Identity dots always perfect circles.

## Screen-specific notes (3-3. 참여자 응답)

- 참고문서 화면04 스펙 그대로: 무가입, 1인 1링크, **스크롤 없이 한 화면**. 회원가입·수량 선택·다단계 옵션 없음.
- 인사 → 대표 메뉴·시간 → **먹어요/안먹어요** 큰 2버튼 → (먹어요 선택 시) 도착시간 칩(제시간/좀 늦어요/모르겠어요 — §13-4 미결 문구, PRD §7.2 예시를 그대로 채택) → "+ 할 말 있어요 (선택)" 접힘 → 응답 완료.
- 로그인 앱 헤더(홈/가구/설정 탭)를 넣지 않음 — 참여자는 앱 사용자가 아니라 링크로만 들어오므로 §6.2 "무가입 참여자: 홈 없이 개인 링크로 단일 식사만"을 반영.
- 별도 "완료" 페이지 파일을 만들지 않고, 제출 시 같은 화면 안에서 완료 상태로 전환(파일 수 최소화 — ponytail 원칙).
