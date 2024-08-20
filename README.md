# healthkungya-backend
건강쿵야 프로젝트 백엔드!

## 코드 스타일 규칙


## 설치 방법

1. **프로젝트 클론:**
   ```bash
   git clone https://github.com/your-repo/healthkungya-backend.git
   cd healthkungya-backend

   의존성 설치: yarn install

   개발 실행: yarn dev
## DB 설정
config 폴더에 db.config.js 수정
<code>
module.exports = {
    HOST: 'localhost',
    USER: '이름', 
    PASSWORD: '비밀번호',
    DB: '디비명'
};

## 프로젝트 구조
<li> router는 HTTP 요청 경로와 메서드에 따라 적절한 Controller 함수를 호출</li>
<li> controller는 비즈니스 로직을 처리하고, Service를 호출하여 데이터를 처리한 후 클라이언트에게 응답</li>
<li> service는 실제 비즈니스 로직과 데이터 처리 작업을 수행하며, 데이터를 조회하거나 수정</li>

</code>

## JWT KEY GENERATOR
처음 설치시 node env 실행 자동으로 env 파일 자동 생성

## 스웨거 라우터에서 문서 작성방법

항상 엔드포인트 위에 작성

<a href="https://any-ting.tistory.com/105"> 문서 작성</a>
