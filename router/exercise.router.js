const express = require("express");
// 컨트롤러 가져오기
const { verifyTokenMiddleware } = require("../authorization/jwt");
const exerciseController = require("../controllers/exercise.controller");

//라우터
const router = express.Router();

/**
 * @swagger
 * /api/exercise_log:
 *   post:
 *     summary: 운동 기록 저장
 *     description: 운동 기록을 저장합니다.
 *     tags:
 *      - Exercise
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/SaveExercise'
 *     responses:
 *       200:
 *         description: 운동 기록이 성공적으로 저장되었습니다.
 *       401:
 *         description: 인증되지 않았습니다.
 *       500:
 *         description: 서버 내부 오류
 */

router.post(
  "/",
  verifyTokenMiddleware,
  exerciseController.SaveExerciseController
);
module.exports = router;
