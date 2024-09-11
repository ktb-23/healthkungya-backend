require("dotenv").config(); // .env 파일에서 환경 변수를 가져오기 위해 필요
const { S3 } = require("@aws-sdk/client-s3"); // AWS SDK v3 S3 클라이언트
const multer = require("multer"); // Express에서 파일 업로드를 쉽게 처리할 수 있게 도와주는 미들웨어
const multerS3 = require("multer-s3"); // multer와 함께 사용될 AWS S3 스토리지 엔진

// AWS 자격증명 .env파일에서 환경변수들을 갖고 온다.
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const uploadimg = multer({
  storage: multerS3({
    s3: s3,
    bucket: "healthkungya-asset/profile",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filename = Date.now().toString() + "-" + file.originalname;
      const key = filename;
      cb(null, key);
    },
  }),
});

module.exports = uploadimg;
