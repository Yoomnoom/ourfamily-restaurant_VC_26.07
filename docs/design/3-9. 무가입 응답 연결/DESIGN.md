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

## Screen-specific notes (3-9. 무가입 응답 연결)

- 참고문서 §7.6 "무가입 응답 → 가입 병합(A+B 병행)"의 **B방식**(카톡이 아닌 경로로 가입 → 확인)을 구현. "예전에 이 링크로 응답했나요? 연결할까요?"를 사용자에게 확인받아 연결하는 화면. A방식(카톡 자동 연결)은 사용자 화면이 따로 없어(자동 처리) 만들지 않음.
- 4번째 페르소나 "김하준"(가입은 안 했지만 가입하고 싶은 가족)이 `3-3. 참여자 응답`에서 응답 완료 후 "가입하고 계속하기"를 누르면 이 화면으로 옴.
- "연결하기" → 과거 무가입 응답이 이어진 채로 `3-1. 홈-카드목록?as=김하준`으로 이동(가구 생성 온보딩 1-2~1-4를 다시 거치지 않음 — 이미 존재하는 가구에 연결되는 것이므로).
- "아니요, 새로 시작할게요" → `1-1. 온보딩-회원가입`(새 가구를 만드는 일반 가입 경로)으로 이동. §7.6 "잘못된 병합 방지" 원칙 반영.
