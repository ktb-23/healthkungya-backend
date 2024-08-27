//라이브러리 가져오기
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { swaggerUi, specs } = require("./module/swagger");
const authRouter = require("./router/auth.router");
const exerciseRouter = require("./router/exercise.router");
const exerciseSearchRouter = require("./router/search.router");
const profileRouter = require("./router/profile.router");
const graphRouter = require("./router/graph.router");
const foodRouter = require("./router/food.router");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8000", "http://localhost:5001"],
    credentials: true,
  })
);
// 포트번호
app.set("port", process.env.PORT || 8000);

// 스웨거
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRouter);
app.use("/api/exercise_log", exerciseRouter);
app.use("/api/exercise", exerciseSearchRouter);
app.use("/api/profile", profileRouter);
app.use("/api/graph", graphRouter);
app.use("/api/food", foodRouter);

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
