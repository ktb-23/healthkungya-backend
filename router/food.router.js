const express = require("express");
const uploadFoodImage = require("../module/uploadfood"); // multer 설정을 내보내는 파일

const router = express.Router();

router.post("/api/food", uploadFoodImage.single("file"), (req, res) => {
  // 파일이 제대로 업로드되었는지 확인하기 위해 콘솔에 로그 추가
  console.log(req.file); // 이 위치에 로그 추가

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // AWS S3가 제공한 파일 위치를 반환
  res.json({ imageUrl: req.file.location });
});

module.exports = router;
