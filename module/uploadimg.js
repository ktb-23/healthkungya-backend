require("dotenv").config(); // .env 파일에서 환경 변수를 가져오기 위해 필요
const { S3 } = require("@aws-sdk/client-s3"); // AWS SDK v3 S3 클라이언트
const multer = require("multer"); // Express에서 파일 업로드를 쉽게 처리할 수 있게 도와주는 미들웨어
const multerS3 = require("multer-s3"); // multer와 함께 사용될 AWS S3 스토리지 엔진
const connection = require("../db");

// AWS 자격증명 .env파일에서 환경변수들을 갖고 온다.
const s3 = new S3({
  region: "ap-northeast-2",
});

// 공통 쿼리 실행 함수
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// 기존 파일을 S3에서 삭제하는 함수
const deleteExistingFile = async (user_id) => {
  try {
    const getImageUrlQuery =
      "SELECT imageUrl FROM profile_tb WHERE user_id = ?";
    const result = await executeQuery(getImageUrlQuery, [user_id]);

    if (result.length > 0 && result[0].imageUrl) {
      const imageUrl = result[0].imageUrl;
      const filename = imageUrl.split("com/")[1]; // S3 버킷 URL 뒤의 파일 경로
      console.log(filename);

      // S3에서 파일 삭제
      await s3.deleteObject({
        Bucket: "ktb-23-healthkungya-backend",
        Key: filename,
      });

      console.log(`s3 에서 성공적으로 삭제 ${filename} `);
    } else {
      console.log("프로필 이미지가 존재하지 않습니다");
    }
  } catch (err) {
    console.error("삭제중 오류 발생:", err);
  }
};

const uploadimg = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ktb-23-healthkungya-be",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: async function (req, file, cb) {
      const userId = req.user.user_id;

      // 기존 파일 삭제
      await deleteExistingFile(userId);
      const timestamp = Date.now();
      const filename = `image/profile/${userId}_${timestamp}.png`;
      cb(null, filename);
    },
    cacheControl: "no-store", // 캐시 설정
  }),
});

module.exports = uploadimg;
