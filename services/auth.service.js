const connection = require("../db");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../authorization/jwt");

// 아이디 중복 체크 컨트롤러
const checkDuplicateId = (id, result) => {
  console.log(id, result);
  const query = "SELECT * FROM user_tb WHERE id = ?";

  connection.query(query, [id], (err, res) => {
    if (err) {
      console.error("데이터베이스 쿼링 에러:", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      // 아이디가 이미 존재할 경우
      result({ message: "아이디가 이미 존재합니다." }, null);
    } else {
      // 중복 없음
      result(null, { message: "아이디 사용 가능합니다." });
    }
  });
};
// 닉네임 중복 체크 컨트롤러
const checkDuplicateNickname = (nickname, result) => {
  const query = "SELECT * FROM user_tb WHERE nickname = ?";

  connection.query(query, [nickname], (err, res) => {
    if (err) {
      console.error("데이터베이스 쿼링 에러:", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      // 닉네임이 이미 존재할 경우
      result({ message: "닉네임이 이미 존재합니다." }, null);
    } else {
      // 중복 없음
      result(null, { message: "닉네임 사용 가능합니다." });
    }
  });
};

// 회원가입 서비스
const register = async (id, password, nickname, weight, result) => {
  // 해시된 비밀번호
  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = [id, hashedPassword, nickname, weight];
  const query =
    "INSERT INTO user_tb (id, password, nickname, weight) VALUES (?,?,?,?)";

  connection.query(query, newUser, (err, res) => {
    if (err) {
      console.error("유저 테이블에 데이터 추가 에러", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { message: "회원가입 성공했습니다", id: res.insertId });
  });
};

// 로그인 서비스
const login = async (id, password, result) => {
  const query = "SELECT * FROM user_tb WHERE id = ?";

  connection.query(query, [id], async (err, res) => {
    if (err) {
      console.error("데이터베이스 쿼링 에러:", err);
      result(err, null);
      return;
    }

    // 유저가 없을 경우
    if (res.length === 0) {
      result({ message: "존재하지 않는 회원" }, null);
      return;
    }

    const user = res[0];

    // 해시된 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      result({ message: "비밀번호가 틀림" }, null);
      return;
    }

    const accesstoken = generateToken({ user_id: user.user_id });
    const refreshtoken = generateRefreshToken({ user_id: user.user_id });

    result(null, {
      nickname: user.nickname,
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    });
  });
};

module.exports = {
  checkDuplicateId,
  checkDuplicateNickname,
  register,
  login,
};
