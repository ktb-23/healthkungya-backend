const express = require("express");
const axios = require("axios");
const router = express.Router();
const connection = require("../config/db.config");

const pythonServerUrl = "http://localhost:5000/api/predict";

// 이미지 분석 라우트
router.post("/analyze", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    // Python 서버로 이미지 URL 전송
    const pythonServerResponse = await axios.get(pythonServerUrl, {
      params: { image_url: imageUrl },
    });

    const tags = pythonServerResponse.data.tags;

    // 데이터베이스에서 음식 정보 가져오기
    if (tags && tags.length > 0) {
      const [foodInfo] = await connection
        .promise()
        .query("SELECT `에너지(kcal)` FROM Food_DB WHERE `음 식 명` = ?", [
          tags[0],
        ]);

      const response = {
        Final_label: tags[0],
        calories: foodInfo[0] ? foodInfo[0]["에너지(kcal)"] : 0,
      };

      res.json(response);
    } else {
      res.status(404).json({ error: "No food detected" });
    }
  } catch (error) {
    console.error("Error analyzing food image:", error);
    res.status(500).json({ error: "Error analyzing food image" });
  }
});

module.exports = router;
