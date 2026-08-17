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

The design system is centered on the concept of **"Information-First, Emotion-Framed."** It aims to transform domestic meal coordination from a chore into a gesture of care. The target audience includes families and shared households who value both the efficiency of coordination and the warmth of a home-cooked meal.

The visual style is a blend of **Minimalism** and **Tactile/Soft design**. It uses high-quality whitespace and a neutral stone-hued background to create a calm atmosphere, while using large "wave-shaped" cards and muted peach accents to introduce a tactile, human touch. The overall mood should feel welcoming, grounded, and reliable.

## Colors

The palette is derived from "Muted Slate and Soft Stone."
- **Stone Grey** acts as the canvas for the entire application, providing a soft, non-intrusive foundation that feels balanced and architectural.
- **White** is reserved for functional cards to ensure the highest contrast for information.
- **Peach** is used for "Emotional Backgrounds," specifically for completion states or empty states to evoke a sense of warmth.
- **Status Colors** (Muted Gold, Slate, Grey) use a desaturated profile. They are semantic: Gold for immediate focus, Slate for upcoming, and Grey for active interactions.
- **Identity Dots**: Use a distinct set of muted-hued named colors (Sage Green, Dusty Purple, etc.) to identify family members. These are strictly for identity and never for status.

## Typography

This design system uses a dual-font strategy:
- **Serif (Noto Serif)**: Used for "Emotional Expressive" layers. This includes meal names on highlight screens, personalized greetings (e.g., "What's for dinner?"), and completion messages. It adds a literary, sophisticated, yet warm touch.
- **Sans-Serif (Plus Jakarta Sans)**: Used for all functional elements. Its soft, rounded terminals complement the overall shape language while maintaining high legibility for lists, buttons, and status tags.

**Scale adjustments**: On mobile, use `headline-lg` (20px) for primary headers to ensure layout density remains comfortable for one-handed use.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile-first, one-handed ergonomics.
- **The "One-Hand Zone"**: Interactive elements like "Yes/No" response chips are positioned in the bottom 40% of the screen.
- **Vertical Rhythm**: Content is stacked in a single column of cards. Each card uses a 1rem (`stack-gap`) vertical margin.
- **Safe Areas**: A 1rem (`safe-area-inset`) horizontal margin is maintained on all screens to ensure content doesn't bleed into screen edges.
- **Breakpoints**:
    - **Mobile**: Single column, full-width cards.
    - **Tablet/Desktop**: Fixed-width central container (max-width: 600px) to maintain the "app-like" intimacy of the experience.

## Elevation & Depth

The design system employs a **"Flat but Layered"** approach. Depth is created through tonal separation rather than traditional shadows.
- **Primary Layer**: Stone background.
- **Content Layer**: White cards sit directly on the background. Instead of deep shadows, use a very subtle, low-opacity neutral-tinted shadow (e.g., `0px 4px 12px rgba(120, 119, 119, 0.08)`) to give the cards a slight lift.
- **Glassmorphism**: Use backdrop blurs (10px - 15px) for top navigation bars or floating action button backgrounds to maintain a sense of space and softness.

## Shapes

The shape language is defined by **Soft, Large Curves**.
- **Wave Cards**: Standard cards use `rounded-lg` (1rem). However, for decorative headers, a custom "Water Wave" svg-mask or a variable border-radius (e.g., `40px 40px 16px 16px`) is encouraged to evoke a organic, friendly feel.
- **Interactive Elements**: Buttons and response chips use `rounded-xl` (1.5rem) or full pill shapes to make them feel "squishy" and tappable.
- **Avatars**: Identity dots and profile images are always perfect circles.

## Components

- **Meal Cards**: The core component. Features a high border radius, white background, and a "vertical identity line" on the left edge (using the User-Defined avatar color).
- **Status Chips**: Small, pill-shaped tags (Gold/Slate/Grey). Use low-saturation backgrounds with higher-saturation text for readability.
- **Response Buttons**: Large, pill-shaped buttons. The "Active" state uses the `primary` slate-grey, while neutral states use a soft grey or stone-tinted outline.
- **Identity Dots**: 8px or 12px circles used in the calendar view and list view to represent specific family members.
- **Oil Pastel Accents**: Use hand-drawn style icons or illustrations for "Meal Complete" or "Empty State" screens. These should look intentionally unrefined and textured, using the soft peach tertiary tones.
- **Drag Handles**: A subtle `≡` icon in a soft neutral grey, used for reordering menu items within a card.

## Screen-specific notes (3-1. 내 식탁, 구 "홈-카드목록")

- **2026-08-16 개명**: 이 화면은 더 이상 하단 탭의 "홈"이 아니다. 진짜 "홈"([3-0. 홈](../3-0.%20홈/DESIGN.md))이 가족 모두가 보는 중립적 요약이 되었고, 이 화면은 로그인한 한 사람의 역할(호스트/게스트) 기반 카드·응답·확정 액션을 보여주는 "한 단계 다음" 화면이다. "가족이 먹고 싶어해요"는 공유 공간인 3-0으로 옮겼다.

- 참고문서 화면03(홈 카드목록·개설자뷰)과 화면07(카드 단위 역할 뷰)을 한 화면에 결합. 같은 홈 리스트 안에서 "내가 만든 식사(host)" 카드와 "참여 요청받은 식사(guest)" 카드가 섞여 보인다.
- 카드 왼쪽 identity line 색은 **역할(호스트/게스트) 색이 아니라 그 식사를 만든 사람의 색**(Meal Cards 컴포넌트 규칙 그대로). 역할 구분은 카드 우측 상단의 작은 라벨("내가 만든 식사" / "참여 요청받음")과 카드 본문 구성(응답 현황 목록 유무, 확정 버튼 유무)으로만 표현한다 — Warm Table 팔레트에 PRD 원안의 파랑/주황 역할색이 없어 임의로 새 색을 추가하지 않기 위함.
- 메뉴 미정 식사는 대표 메뉴 자리에 "메뉴 정하는 중"을 이탤릭 아님 · 회색 텍스트로 표시해 빈칸처럼 보이지 않게 한다.
