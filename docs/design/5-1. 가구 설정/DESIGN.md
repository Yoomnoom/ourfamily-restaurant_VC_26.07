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
  secondary-container: '#e3e2e3'
  on-secondary-container: '#646465'
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

## Screen-specific notes (5-1. 가구 설정)

- 참고문서 §6.1 "가구 층: 구성원 초대·내보내기·기본 공개 범위"와 §15 Must "손님 저장"을 근거로 제작. PRD §10엔 번호가 없지만 홈 하단 탭 "가구"가 지금까지 자리표시자였던 것을 채움.
- 구성원 목록은 `localStorage['onboarding_members']`를 읽어와 표시(온보딩에서 등록한 색·이름 재사용). 손님 목록은 이 화면에서 추가한 것만 `localStorage['saved_guests']`에 저장(재사용 목적, §15 "손님 저장").
- 가구 소유권·여러 관리자 문제는 참고문서 §13 미결 질문 5번(착수 전 미확정) — 이 화면에서는 "첫 개설자=관리자" 임시 가정만 반영하고 관리자 이양 등은 만들지 않음.
