const express = require("express");
// 컨트롤러 가져오기
const { verifyTokenMiddleware } = require("../authorization/jwt");
const graphController = require("../controllers/graph.controller");

//라우터
const router = express.Router();
/**
 * @swagger
 * /api/graph/exercise:
 *   get:
 *     summary: 현재 주의 운동 데이터 가져오기
 *     tags: [Graph]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: 'weekly'
 *         description: 주말인지 월인지 타입.
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: '2024-08-10'
 *         description: 냘쨔.
 *     responses:
 *       200:
 *         description: '주간 운동 데이터가 성공적으로 반환됩니다.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExerciseData'
 *       400:
 *         description: '잘못된 요청입니다. 쿼리 파라미터가 유효하지 않습니다.'
 *       401:
 *         description: '인증되지 않았습니다. 토큰이 유효하지 않거나 누락되었습니다.'
 *       500:
 *         description: '서버 내부 오류입니다. 데이터를 가져오는 중 오류가 발생했습니다.'
 */
router.get("/exercise", verifyTokenMiddleware, graphController.ExerciseGraph);
module.exports = router;
