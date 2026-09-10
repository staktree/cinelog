# 프로젝트 컨텍스트 
영화 감상평을 작성하고 조회할 수 있는 서비스 


## 기술스택
- Next.js, TypeScript
- Tailwind CSS 
- Supabase (Auth, Postgres DB)
- 테스트 : Jest + Testing Library 
- FE 단일 프로젝트

## 주요 기능
- 감상평 작성
- 감상평 조회
- 감상평 수정

## 작업 수행 룰 
1. 각 기능의 디자인은 아래 작성한 와이어프레임을 참고해서 진행해줘. 
메인화면구성 : @wireframe/화면 구성_감상평 조회.png
감성평 작성 : @wireframe/화면 구성_감상평 작성.png, @wireframe/화면 구성_감상평 작성_영화포스터등록.png
감상평 조회 :  @wireframe/화면 구성_감상평 조회.png, @wireframe/화면 구성_감상평 표시.png
감상평 수정 : @wireframe/화면 구성_감상평 표시.png, @wireframe/화면 구성_감상평 작성.png
영화정보 조회 : @wireframe/화면구성_영화정보조회.png
2. @PRD.md를 참고해서 프로젝트에 대한 기본 정보를 인식해. 
3. 각 기능은 아래 작성한 기능 명세를 참고해서 진행해줘. 
SDD 폴더 하위에 있어.
감상평 작성 : @SDD/감상평작성기능명세.md
감상평 조회 : @SDD/감상평조회기능명세.md
감상평 수정 : @SDD/감상평수정기능명세.md
영화정보 조회 : @SDD/영화정보조회기능명세.md
로그인 : @SDD/로그인기능명세.md (별도 와이어프레임 없음, 기존 화면 톤에 맞춘 폼으로 구현)

4. 워크플로우는 @SDD/워크플로우.md를 참고해줘.
5. 네트워크/외부 API 연동 설정을 새로 추가하거나 변경할 때(예: 새 외부 도메인 호출, TLS·CA·proxy
   관련 에러 대응)는 반드시 @networkSetting/네트워크연결설정.md를 먼저 참고해줘.
   사내망 SSL 검사 프록시로 인한 `fetch failed`류 이슈와 그 대응(NODE_EXTRA_CA_CERTS)이
   정리되어 있으니, 관련 증상이 재현되면 이 문서의 절차부터 따른다.

## 코딩 컨벤션
- 함수는 Arrow Function 대신 Name Function을 사용. 
- 에러는 반드시 컨스텀 에러 클래스로 처리
- 함수명/변수명은 코드 표준 준수


## 커밋규칙 
- Conventioanl Commits 형식 필수(feat/fix/docs/refactor/test)
- PR 제목도 동일한 형식 적용 
- 깃 원격 저장소 : https://github.com/staktree/cinelog.git

## 금지사항
.env는 절대 커밋 금지

## 언어 및 커뮤니케이션 규칙 
- 기본 응답 언어 : 한국어 
- 코드 주석 : 한국어
- 커밋 메시지 : 한국어 
- 문서화 : 한국어 

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
