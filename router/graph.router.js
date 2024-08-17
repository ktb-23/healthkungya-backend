const express = require("express");
// 컨트롤러 가져오기
const { verifyTokenMiddleware } = require("../authorization/jwt");
const graphController = require("../controllers/graph.controller");

//라우터
const router = express.Router();

router.get("/exercise", verifyTokenMiddleware, graphController);
module.exports = router;
