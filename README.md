# 코드 스타일 가이드라인 (풀스택)

프론트엔드에서 적용하는 코드 스타일 가이드라인입니다.

## 언어/프레임워크

| 언어       | 프레임워크 | 라이브러리 | SQL   |
| ---------- | ---------- | ---------- | ----- |
| Javascript | Express.js | Swagger.js | MySQL |

## 스타일, 사용 툴

### ESLint

1. 설치 & 세팅

   - Code - Preference - Extentions 에서 EsLint 검색 후 Install를 눌러서 설치한다. 

    <pre><code>
      //.eslintrc.js

      "eslintConfig": {
       "extends": "react-app"
       }
   </code></pre>

2. ESLint+ Airbnb Style Guid

   - eslint-config-airbnb를 포함 필수 5개의 플러그인 설치 (npm +5를 사용한다고 가정)
    <pre><code>
    npx install-peerdeps --dev eslint-config-airbnb
   </code></pre>

3. ESLint 세부설정

   - package.json / .eslintrc.js / .eslintrc.json 파일 세곳중 한 곳에서 config 설정을 한다.
   - 프로젝트 최상단 폴더에 파일을 생성해주고 다음과 같은 코드를 작성한다.
    <pre><code>
       {
         "extends": ["airbnb", "prettier", "plugin:node/recommended"],
         "plugins": ["prettier"],
         "rules": {
           "prettier/prettier": "error",
           "no-unused-vars": "warn",
           "no-console": "off",
           "func-names": "off",
           "no-process-exit": "off",
           "object-shorthand": "off",
           "class-methods-use-this": "off"
         }
       }
   </code></pre>

   ### Prettier

   1. 설치 & 세팅

   - Code - Preference - Extentions 에서 Prettier 검색 후 Install를 눌러서 설치한다.
   - VS code 설정에 들어가 'Default Formatter'를 검색하고, '없음'에서 'Prettier - Code formatter'로 변경한다.
   - 프로젝트의 root directory에 .prettier.json/ .prettier.js 파일 둘 중 하나를 생성하여 아래 코드를 작성한다.
    <pre><code>
     arrowParens: 'always'
     bracketSpacing: true
     jsxBracketSameLine: false
     jsxSingleQuote: false
     printWidth: 80
     proseWrap: 'always'
     quoteProps: 'as-needed'
     semi: true
     singleQuote: true
     tabWidth: 2
     trailingComma: 'es5'
     useTabs: false
   </code></pre>
   - Airbnb 코딩 규칙을 적용할 코드를 열고 F1를 누른 뒤, 'Format Document'를 입력하고 실행한다.
   - 더 간편하게 사용하기 위해, Ctrl + ,를 눌러 설정에 들어가서 'Format on Save' 를 검색하고 설정을 한다.

     -> 저장할 때 자동으로 Airbnb 코딩 규칙으로 변환되어 저장된다.

## 설치 방법

## 로컬 개발 환경 설정 가이드

이 문서는 Mac에서 Node.js, MySQL을 사용하여 로컬 개발 환경을 설정하는 방법을 안내합니다.

## 📋 목표 및 개요

이 가이드는 다음을 설정하는 방법을 설명합니다:

- Node.js, npm 설치, yarn 설치
- MySQL
- Node.js 서버

## 🛠️ 사전 요구 사항

- **하드웨어**: Macbook pro 14 inch m2 pro
- **소프트웨어**: 최신 macOS: sonoma 14.5
- **기타**: 시스템 관리자 권한
- - 크롭 권장 \*\*

## 🚀 초기 설정

### 1. Homebrew 설치

Homebrew는 macOS의 패키지 관리자입니다. 터미널에서 다음 명령어를 실행하여 설치합니다:

Node.js, npm 설치, yarn 설치

```bash
brew install node

// 설치 확인
node -v
npm -v

npm install -g yarn
yarn --version
```

MySQL 설치

```bash
brew install mysql

// 서비스 시작
brew services start mysql

// 버전 확인
mysql --version

```

**프로젝트 클론:**

```bash
git clone <https://github.com/ktb-23/healthkungya-backend.git>
cd healthkungya-backend

의존성 설치: yarn install

프론트 엔드 개발 실행: yarn run dev
백엔드 개발 실행: yarn run dev

```

## DB 설정

config 폴더에 db.config.js 수정

```json
module.exports = {
	HOST: '주소',
	USER: '이름',
	PASSWORD: '비밀번호',
	DB: '디비명'
}
```

## env 파일

```json
JWT_SECRET=시크릿키
JWT_REFRESH_SECRET=시크릿키
PORT=포트번호
AWS_REGION=서버 위치
AWS_ACCESS_KEY_ID=액세스키
AWS_SECRET_ACCESS_KEY=시크릿 액세스 키
```

## 프로젝트 구조

- router는 HTTP 요청 경로와 메서드에 따라 적절한 Controller 함수를 호출
- controller는 비즈니스 로직을 처리하고, Service를 호출하여 데이터를 처리한 후 클라이언트에게 응답
- service는 실제 비즈니스 로직과 데이터 처리 작업을 수행하며, 데이터를 조회하거나 수정
