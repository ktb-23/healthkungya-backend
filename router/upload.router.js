const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const router = express.Router();
require("dotenv").config();

// AWS 설정
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Multer 및 Multer-S3 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },
  }),
});

// 파일 업로드 라우트
router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    const imageUrl = req.file.location;
    res.json({ imageUrl });
  } else {
    res.status(400).json({ error: "파일 업로드에 실패했습니다." });
  }
});

module.exports = router;
