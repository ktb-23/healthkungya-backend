const graphService = require("../services/graph.service");

// 운동량 데이터 조회
const ExerciseGraph = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const userId = req.user.user_id;
  const { type, date } = req.query;
  try {
    if (type === "weekly" && date) {
      await graphService.getWeeklyExerciseData(userId, date, (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "운동량 데이터 조회 중 오류 발생:" });
        }
        res.status(200).json(data);
      });
    }
  } catch (error) {
    console.error("운동량 데이터 조회 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};
// 운동량 데이터 조회
const WeightGraph = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const userId = req.user.user_id;
  const { type, date } = req.query;
  try {
    if (type === "weekly" && date) {
      await graphService.getWeeklyWeightData(userId, date, (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "몸무게 데이터 조회 중 오류 발생:" });
        }
        res.status(200).json(data);
      });
    }
  } catch (error) {
    console.error("몸무게 데이터 조회 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};
module.exports = { ExerciseGraph, WeightGraph };
