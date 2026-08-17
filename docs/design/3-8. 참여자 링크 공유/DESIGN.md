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

## Screen-specific notes (3-8. 참여자 링크 공유)

- 참고문서 §7.1 "1인 1고유 링크"(Must, §15): 참여자마다 자기만의 고유 링크. 공용 명단은 같이 보되 실제 응답 링크는 개인별. §9 알림: MVP는 카톡 링크 **수동 공유** + 앱 푸시(가입자).
- `3-2. 식사 만들기`에서 "식사 만들기" 완료 시 이 화면으로 이동(기존엔 alert 후 바로 홈으로 보냈던 placeholder를 교체).
- 각 참여자 행의 "미리보기" 버튼은 `3-3. 참여자 응답?name=`으로 연결해, 그 사람이 실제로 보게 될 화면을 개설자가 확인할 수 있게 함.
- 카카오톡 공유는 실제 SDK 연동 없이 버튼만 배치(정적 목업 범위 밖) — 클릭 시 "카카오톡 공유는 실제 서비스에서 연동돼요" 안내만.
