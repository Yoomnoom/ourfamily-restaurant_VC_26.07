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

## Screen-specific notes (6-1. 오류·복구 상태)

- GPT자료(`0. 확인용자료/GPT자료/05_errors_recovery_43-54.png`)가 유일하게 갖고 있던 강점(에러 12종)인데, 지금까지 실제 화면으로 하나도 안 만들어져 있었음. 참고문서엔 에러 상태 설계가 없어서(§10에 번호 없음) 전적으로 GPT자료 기반.
- 실제 서비스라면 각 에러가 해당 화면(로그인, 응답, 링크 등) 안에서 조건부로 나타나야 하지만, 정적 목업이라 GPT자료 원본처럼 **12개 상태를 한 장에 모아보는 참고 시트**로 제작(파일 수 최소화, ponytail). 각 카드가 실제로 어느 화면에 붙는지는 카드 하단에 표기.
- 인증(43-44) → `2-2. 로그인`에 붙음 / 입력누락·네트워크(45-46) → `3-2. 식사 만들기`·전역 / 응답저장(47) → `3-3. 참여자 응답` / 링크 관련(48-50) → `3-3` 진입 전 / 취소·삭제(51-52) → `3-1`·`4-2` / 수정불가(53) → `3-3`·`3-4` / 가구 권한(54) → `5-1`.
