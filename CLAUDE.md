# 프로젝트 컨텍스트 
영화 감상평을 작성하고 조회할 수 있는 서비스 


## 기술스택
- Next.js, TypeScript
- Tailwind CSS 
- Supabase (Auth / Database / Storage) - 회원 인증 및 감상평 데이터 저장
- 테스트 : Jest + Testing Library 
- FE + Supabase(BaaS) 구조 (별도 백엔드 서버 없음)

## 주요 기능
- 회원가입 / 로그인 / 로그아웃 (Supabase Auth, 이메일/비밀번호)
- 감상평 작성 (로그인 필요)
- 감상평 조회 (로그인 필요, 본인이 작성한 감상평만 조회)
- 감상평 수정 (로그인 필요, 본인 소유 감상평만 수정)
- 영화정보 조회 (비로그인 상태에서도 접근 가능)

## 작업 수행 룰 
1. 각 기능의 디자인은 아래 작성한 와이어프레임을 참고해서 진행해줘. 
메인화면구성 : @wireframe/화면 구성_감상평 조회.png
감성평 작성 : @wireframe/화면 구성_감상평 작성.png, @wireframe/화면 구성_감상평 작성_영화포스터등록.png
감상평 조회 :  @wireframe/화면 구성_감상평 조회.png, @wireframe/화면 구성_감상평 표시.png
감상평 수정 : @wireframe/화면 구성_감상평 표시.png, @wireframe/화면 구성_감상평 작성.png

2. @PRD.md를 참고해서 프로젝트에 대한 기본 정보를 인식해. 
3. 각 기능은 아래 작성한 기능 명세를 참고해서 진행해줘. 
SDD 폴더 하위에 있어.
회원가입/로그인 : @SDD/회원가입로그인기능명세.md
감상평 작성 : @SDD/감상평작성기능명세.md
감상평 조회 : @SDD/감상평조회기능명세.md
감상평 수정 : @SDD/감상평수정기능명세.md
영화정보 조회 : @SDD/영화정보조회기능명세.md
4. 워크플로우는 @SDD/워크플로우.md를 참고해줘.
5. 회원가입/로그인 화면은 아직 와이어프레임이 없음. 별도 와이어프레임 제공 전까지는 기존 팝업 스타일(감상평 작성 팝업 등)과 통일된 톤으로 구현해줘.

## 코딩 컨벤션
- 함수는 Arrow Function 대신 Name Function을 사용. 
- 에러는 반드시 컨스텀 에러 클래스로 처리
- 함수명/변수명은 코드 표준 준수


## 저장소
- Remote: https://github.com/staktree/cinelog.git
- 기본 브랜치: master

## 커밋규칙 
- Conventioanl Commits 형식 필수(feat/fix/docs/refactor/test)
- PR 제목도 동일한 형식 적용 

## 배포 워크플로우
- 사용자가 "배포 요청"하면:
  1. 진행한 기능 단위로 브랜치를 하나 생성한다 (예: `feat/기능이름`)
  2. 변경사항을 해당 브랜치에 커밋한다 (Conventional Commits 형식)
  3. `master` 브랜치를 대상으로 PR을 생성한다 (제목도 Conventional Commits 형식)

## 금지사항
.env는 절대 커밋 금지

## 언어 및 커뮤니케이션 규칙 
- 기본 응답 언어 : 한국어 
- 코드 주석 : 한국어
- 커밋 메시지 : 한국어 
- 문서화 : 한국어 

## TMDB API 
- API Read Access Token / API Key는 `.env.local`에 보관 (TMDB_API_ACCESS_TOKEN, TMDB_API_KEY)
- 영화 이미지나 정보를 TMDB API에서 조회하여 가져온다. 

## Supabase
- Project URL / anon key / service role key는 `.env.local`에 보관 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용(마이그레이션 스크립트 등)이며, 절대 클라이언트 코드나 `NEXT_PUBLIC_` 접두사로 노출하지 않는다.
- 인증(Auth) : 이메일/비밀번호 방식만 사용
- 데이터베이스(Database) : 감상평(`reviews` 테이블)을 저장. RLS(Row Level Security)로 본인 소유 데이터만 접근 가능하도록 제한
- 스토리지(Storage) : 감상평 포스터 이미지를 저장하는 버킷(`review-posters`). DB에는 이미지 파일 경로만 저장하고 실제 파일은 Storage에 저장



