//라이브러리 가져오기
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { swaggerUi, specs } = require("./module/swagger");
const authRouter = require("./router/auth.router");
app.use(express.json());
app.use(cors());
// 포트번호
app.set("port", process.env.PORT || 8000);

// 스웨거
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRouter);

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
