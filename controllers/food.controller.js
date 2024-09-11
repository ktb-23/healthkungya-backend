const axios = require("axios");
const foodService = require("../services/food.service");
const SaveFoodImageController = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "인증 권한 없음" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { date, mealtype } = req.query;
  const imageKey = req.file.key;
  const imageUrl = `https://healthkungya-asset.s3.ap-northeast-2.amazonaws.com/${imageKey}`;
  const userId = req.user.user_id;

  try {
    const foodlog_id = await foodService.SavefoodImage(
      userId,
      date,
      mealtype,
      imageUrl
    );

    const predictResponse = await axios.get("http://127.0.0.1:5001/predict", {
      params: { image_url: imageUrl, foodlog_id },
    });

    return res.status(200).json({
      foodlog_id,
      imageUrl,
      message: predictResponse.data.message,
    });
  } catch (error) {
    console.error("프로필 이미지 저장 중 오류 발생", error);
    return res
      .status(500)
      .json({ message: "서버 내부 오류", error: error.message });
  }
};
const SaveFoodLog = async (req, res) => {
  const { foodlog_id } = req.params;
  const data = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "인증 권한 없음" });
  }
  try {
    const userId = req.user.user_id;
    await foodService.SaveFoodLog(userId, foodlog_id, data);
    return res.status(200).json({ message: "성공적으로 업데이트 되었습니다." });
  } catch (error) {
    console.error("음식 기록 업데이트 중 오류 발생", error);
    return res
      .status(500)
      .json({ message: "서버 내부 오류", error: error.message });
  }
};
const GetFoodLog = async (req, res) => {
  const { date, mealtype } = req.query;
  if (!req.user) {
    return res.status(401).json({ message: "인증 권한 없음" });
  }
  try {
    const userId = req.user.user_id;
    const data = await foodService.getFoodLog(userId, date, mealtype);
    return res.status(200).json(data);
  } catch (error) {
    console.error("음식 기록 조회 중 오류 발생", error);
    return res
      .status(500)
      .json({ message: "서버 내부 오류", error: error.message });
  }
};

const GetAllFoodLog = async (req, res) => {
  const { date } = req.query;
  console.log(date);
  if (!req.user) {
    return res.status(401).json({ message: "인증 권한 없음" });
  }
  try {
    const userId = req.user.user_id;
    const data = await foodService.getAllFoodLog(userId, date);
    return res.status(200).json(data);
  } catch (error) {
    console.error("음식 기록 조회 중 오류 발생", error);
    return res
      .status(500)
      .json({ message: "서버 내부 오류", error: error.message });
  }
};

const GetAllDateFoodlogLogController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const userId = req.user.user_id;
  try {
    await foodService.GetAllDateFoodlog(userId, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "전체 음식기록 조회 중 오류 발생", error: err });
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    console.error("전체 음식기록 조회 중 오류 발생", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};
module.exports = {
  SaveFoodImageController,
  SaveFoodLog,
  GetFoodLog,
  GetAllFoodLog,
  GetAllDateFoodlogLogController,
};
