require("dotenv").config();
const { S3 } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const uploadFoodImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "healthkungya-front", // S3 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filename = `food/${Date.now().toString()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

module.exports = uploadFoodImage;
