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
  exerciseController.SaveExerciseLogController
);
/**
 * @swagger
 * /api/exercise_log/{log_id}:
 *   put:
 *     summary: 운동 기록 수정
 *     description: 운동 수정을 합니다.
 *     tags:
 *       - Exercise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: log_id
 *         required: true
 *         schema:
 *           type: number
 *         description: 수정할 운동 기록의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExercise'
 *     responses:
 *       200:
 *         description: 운동 기록 수정 성공
 *       401:
 *         description: 인증 권한 없음
 *       500:
 *         description: 서버 내부 오류
 */
router.put(
  "/:log_id",
  verifyTokenMiddleware,
  exerciseController.UpdateExerciseLogController
);
/**
 * @swagger
 * /api/exercise_log/{date_id}:
 *   get:
 *     summary: 운동 기록 조회
 *     description: 특정 날짜에 해당하는 운동 기록을 조회합니다.
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 날짜 ID
 *     responses:
 *       200:
 *         description: 운동 기록이 성공적으로 조회되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/GetExercise'
 *       401:
 *         description: 인증되지 않았습니다.
 *       500:
 *         description: 서버 내부 오류
 */

router.get(
  "/:date_id",
  verifyTokenMiddleware,
  exerciseController.GetExerciseLogController
);
module.exports = router;
