const express = require("express");
// 컨트롤러 가져오기
const { verifyTokenMiddleware } = require("../authorization/jwt");
const weightController = require("../controllers/weight.controller");

//라우터
const router = express.Router();
/**
 * @swagger
 * /api/weight:
 *   post:
 *     summary: 몸무게 저장
 *     description: 몸무게 저장합니다.
 *     tags:
 *      - Weight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/SaveWeight'
 *     responses:
 *       200:
 *         description: 몸무게가 성공적으로 저장되었습니다.
 *       401:
 *         description: 인증되지 않았습니다.
 *       500:
 *         description: 서버 내부 오류
 */
router.post("/", verifyTokenMiddleware, weightController.SaveWeightController);

/**
 * @swagger
 * /api/weight/{weight_id}:
 *   put:
 *     summary: 몸무게 수정
 *     description: 자신의 몸무게를 수정을 합니다.
 *     tags:
 *       - Weight
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: weight_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 몸무게 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateWeight'
 *
 *     responses:
 *       200:
 *         description: 몸무게 수정 성공
 *       401:
 *         description: 인증 권한 없음
 *       500:
 *         description: 서버 내부 오류
 */
router.put(
  "/:weight_id",
  verifyTokenMiddleware,
  weightController.UpdateWeightController
);
module.exports = router;
