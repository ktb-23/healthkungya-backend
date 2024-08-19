// jwt 라이브러리를 불러와줍니다.
const jwt = require("jsonwebtoken");

//secretekey 불러오기
const secretKey = process.env.JWT_SECRET;
//refreshKey 불러오기
const refreshSecretKey = process.env.JWT_REFRESH_SECRET;

//토큰 생성 함수
function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "1800s" });
}

//리프레쉬 토큰 생성 함수
function generateRefreshToken(payload) {
  return jwt.sign(payload, refreshSecretKey, { expiresIn: "7d" });
}

//토큰 검증 함수
function verifyToken(token) {
  try {
    console.log("받은 토큰", token);
    console.log("시크릿 키", secretKey);
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

//리프레쉬 토큰 검증 함수
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, refreshSecretKey);
  } catch (error) {
    return null;
  }
}

function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "Authorization header is missing" });
  }
  const token = authHeader.split("Bearer ")[1]; // header에서 access token을 가져옵니다.
  if (!token) {
    return res.status(403).json({ message: "토큰이 없습니다." });
  }

  const decoded = verifyToken(token);
  console.log(decoded);
  if (!decoded) {
    return res.status(401).json({ message: "인증 권한이 없음" });
  }

  req.user = decoded;
  next();
}
module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  verifyTokenMiddleware,
};
