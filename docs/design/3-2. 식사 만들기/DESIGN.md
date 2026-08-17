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

## Screen-specific notes (3-2. 식사 만들기)

- 참고문서 화면02 스펙: 6단계 마법사가 아니라 **한 화면에 섹션 4개**(언제 → 메뉴 → 종류 → 누구에게 물어볼까요)가 위에서 아래로 쌓이는 단일 스크롤 폼. GPT/Manus 참고자료는 둘 다 다단계 마법사였지만, 참고문서 원안(§10 화면02)과 "강요하지 않고 덜어준다"는 철학(입력 단계를 늘리지 않음)에 맞춰 단일 화면으로 제작.
- 메뉴는 순서가 있는 태그 리스트. 첫 번째 태그 = 대표 메뉴("대표" 배지 표시), 드래그로 순서 변경 가능(`≡` 핸들). 참고문서 §12 데이터 모델의 `sort_order`(0=대표)와 대응.
- 종류(집밥/외식/배달) 칩은 기본값 "집밥" 선택. 참고문서 §10 화면02·§12 `meal_type` 필드 대응. 이 칩은 **달력에는 표시하지 않고 그날 상세·통계에서만 쓰인다**(§10 화면08·09 참고).
- 참여 대상은 가구 구성원이 기본 선택되어 있고(로컬스토리지 `onboarding_members`에서 로드), "+ 손님"으로 임시 게스트 추가 가능.
- 날짜/시간 입력에서 시간은 선택(미정 가능) — 참고문서 §10 "시간은 선택·미정 가능"을 반영해 "시간 미정" 토글 제공.
