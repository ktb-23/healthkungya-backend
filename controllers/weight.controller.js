const weightService = require("../services/weight.service");
const SaveWeightController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const body = req.body;
  const userId = req.user.user_id;

  try {
    // 몸무게 저장 서비스 호출
    await weightService.saveWeight(userId, body, (err, message) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "몸무게 저장 중 오류 발생", error: err });
      }
      return res.status(200).json({ message: message });
    });
  } catch (error) {
    console.error("몸무게 저장 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};
module.exports = {
  SaveWeightController,
};
