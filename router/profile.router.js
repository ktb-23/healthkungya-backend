const express = require("express");
// 컨트롤러 가져오기
const { verifyTokenMiddleware } = require("../authorization/jwt");
const profileController = require("../controllers/profile.controller");
const uploadimg = require("../module/uploadimg");

//라우터
const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: 프로필 조회
 *     description: 유저 프로필을 조회합니다.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 프로필을 성공적으로 조회되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/GetProfile'
 *       401:
 *         description: 인증되지 않았습니다.
 *       500:
 *         description: 서버 내부 오류
 */

router.get("/", verifyTokenMiddleware, profileController.GetProfileController);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: 프로필 수정
 *     description: 프로필 수정을 합니다.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:  # 이 줄의 들여쓰기를 수정했습니다.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 *       401:
 *         description: 인증 권한 없음
 *       500:
 *         description: 서버 내부 오류
 */

router.put(
  "/",
  verifyTokenMiddleware,
  profileController.UpdateProfileController
);

router.post(
  "/image",
  verifyTokenMiddleware,
  uploadimg.single("profileImage"),
  profileController.SaveProfileImageController
);
module.exports = router;
