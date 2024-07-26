//라이브러리 가져오기
const express = require("express");
// 컨트롤러 가져오기
const authController = require("../controllers/auth.controller");

//라우터
const router = express.Router();

router.get("/check-duplicate", authController.checkDuplicate);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     description: 유저 생성 회원가입
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     description: 유저 로그인
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: 회원 로그인 성공
 *       401:
 *         description: 인증 권한 없음
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/protected:
 *   get:
 *     summary: 보호된 엔드포인트
 *     description: 인증된 유저만 접근 가능
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         description: 토큰이 없음
 *       401:
 *         description: 인증 실패
 */
// router.get("/protected",verifyTokenMiddleware,authController.test)

// /**
//  * @swagger
//  * /api/auth/refresh:
//  *   post:
//  *     summary: 새 토큰 갱신
//  *     description: 리프레시 토큰을 통해 새로운 액세스 토큰을 발급
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               refreshToken:
//  *                 type: string
//  *                 description: 리프레시 토큰
//  *     responses:
//  *       200:
//  *         description: 새로운 액세스 토큰 발급 성공
//  *       403:
//  *         description: 유효하지 않은 리프레시 토큰
//  */
// router.post("/refresh",authController.refresh)

module.exports = router;
