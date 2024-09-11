require("dotenv").config();
const { S3 } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3({
  region: "ap-northeast-2",
});

const uploadFoodImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ktb-23-healthkungya-be", // S3 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const userId = req.user.user_id;
      const timestamp = Date.now();
      const filename = `image/food/${userId}_${timestamp}.png`;
      cb(null, filename);
    },
  }),
});

module.exports = uploadFoodImage;
