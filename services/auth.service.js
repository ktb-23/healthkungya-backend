const connection = require("../db");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../authorization/jwt");
// 공통 쿼리 실행 함수
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
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

  connection.query(query, newUser, async (err, res) => {
    if (err) {
      console.error("유저 테이블에 데이터 추가 에러", err);
      result(err, null);
      return;
    }
    // 프로필 생성 및 예외 처리
    try {
      await profile(res.insertId);
      console.log("created user: ", { id: res.insertId, ...newUser });
      result(null, { message: "회원가입 성공했습니다", id: res.insertId });
    } catch (profileErr) {
      console.error("프로필 생성 중 에러 발생", profileErr);
      result(profileErr, null);
    }
  });
};
const profile = async (userId) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO profile_tb (user_id) VALUES (?)";
    connection.query(query, [userId], (err, res) => {
      if (err) {
        console.error("프로필 테이블에 데이터 추가 에러", err);
        reject(err);
      } else {
        console.log("프로필 저장");
        resolve(res);
      }
    });
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
      user_id: user.user_id,
      nickname: user.nickname,
      weight: user.weight,
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    });
  });
};
// 회원 삭제 컨트롤러
const deleteUser = async (userId, result) => {
  // 트랜잭션 시작
  connection.beginTransaction(async (transactionError) => {
    if (transactionError) {
      console.error("트랜잭션 시작 에러:", transactionError);
      result(transactionError, null);
      return;
    }

    try {
      // 운동 기록 삭제
      await executeQuery("DELETE FROM exlog_tb WHERE user_id=?", [userId]);

      // 음식 기록 삭제
      await executeQuery("DELETE FROM foodlog_tb WHERE user_id=?", [userId]);

      // 몸무게 삭제
      await executeQuery("DELETE FROM weight_tb WHERE user_id=?", [userId]);

      //  날짜 기록 삭제
      await executeQuery("DELETE FROM date_tb WHERE user_id=?", [userId]);

      // 프로필 삭제
      await executeQuery("DELETE FROM profile_tb WHERE user_id=?", [userId]);

      // 사용자 삭제
      await executeQuery("DELETE FROM user_tb WHERE user_id=?", [userId]);

      // 트랜잭션 커밋
      connection.commit((commitError) => {
        if (commitError) {
          console.error("트랜잭션 커밋 에러:", commitError);
          connection.rollback(() => {
            result(commitError, null);
          });
        } else {
          result(null, "회원을 성공적으로 삭제했습니다.");
        }
      });
    } catch (error) {
      console.error("회원 삭제 중 오류 발생:", error);
      connection.rollback(() => {
        result(error, null);
      });
    }
  });
};

module.exports = {
  checkDuplicateId,
  checkDuplicateNickname,
  register,
  login,
  deleteUser,
};
