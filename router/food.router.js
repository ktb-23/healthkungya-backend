const express = require("express");
const uploadFoodImage = require("../module/uploadfood"); // multer 설정을 내보내는 파일

//라우터
const router = express.Router();

router.post("/uploadImage", uploadFoodImage.single("file"), (req, res) => {
  console.log("진입");
  // console.log(req.params.food_id);
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ imageUrl: req.file.location });
});

module.exports = router;
