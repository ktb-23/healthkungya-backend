const express = require("express");
// 컨트롤러 가져오기
const exerciseController = require("../controllers/exercise.controller");

//라우터
const router = express.Router();
router.get("/search", exerciseController.GetSearchExerciseController);
/**
 * @swagger
 * /api/exercise/search:
 *   get:
 *     summary: 운동 검색
 *     description: 운동 이름으로 운동을 검색합니다.
 *     tags: [Exercise]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색어
 *     responses:
 *       200:
 *         description: 검색된 운동 목록이 성공적으로 반환되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchExercise'
 *       400:
 *         description: 잘못된 요청입니다.
 *       500:
 *         description: 서버 내부 오류
 */

module.exports = router;
