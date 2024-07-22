# healthkungya-backend
건강쿵야 프로젝트 백엔드!

## 설치 방법

1. **프로젝트 클론:**
   ```bash
   git clone https://github.com/your-repo/healthkungya-backend.git
   cd healthkungya-backend

   의존성 설치: npm install

   개발 실행: npm run dev
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

post
<div>
/**
 * @swagger
 * /api/v1/post:
 *   post:
 *     summary: 유저 게시물 작성
 *     description: 유저 게시물 작성
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: [] // 인증 권한 사용할건지
 *     requestBody:
 *       required: true // 리퀘스트 바디가 필요 여부
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/SavePost' // 컴포넌트 폴더가서 바디에 들어갈 내용 추가 
 *     responses:
 *       200:
 *         description: 게시물 작성 성공
 *       403:
 *         description: 토큰이 없음
 *       404:
 *         description: 유저가 없음
 *       401:
 *         description: 인증 권한이 없음
 */
 </div>

 get
 <code>
/**
 * @swagger
 * /api/v1/post/{post_id}:
 *   get:
 *     summary: 상세 게시물 조회
 *     description: 상세 게시물 조회
 *     tags:
 *       - Post
 *     parameters: //파라미터 값들 
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 게시물의 ID
 *     responses:
 *       200:
 *         description: 상세 게시물 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Post'
 *       403:
 *         description: 토큰이 없음
 *       404:
 *         description: 유저가 없음
 *       401:
 *         description: 인증 권한이 없음
 */
 </code>
 
 put
 <div>
/**
 * @swagger
 * /api/v1/profile:
 *   put:
 *     summary: 프로필 업데이트
 *     description: 유저 프로필 업데이트
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: [][]// 인증 권한
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserProfile'
 *     responses:
 *       200:
 *         description: 유저 프로필 업데이트 성공
 *       403:
 *         description: 토큰이 없음
 *       404:
 *         description: 유저가 없음
 *       401:
 *         description: 인증 권한이 없음
 */
 </div>
 
delete
<code>
/**
 * @swagger
 * /api/v1/profile:
 *   delete:
 *     summary: 유저 프로필 삭제
 *     description: 유저 프로필을 삭제합니다.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []// 인증 권한
 *     parameters: // 쿼리 방식
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 삭제할 유저의 ID
 *     responses:
 *       200:
 *         description: 유저 프로필 삭제 성공
 *       403:
 *         description: 인증 토큰이 없음
 *       404:
 *         description: 유저를 찾을 수 없음
 *       401:
 *         description: 인증 권한이 없음
 */
</code>

