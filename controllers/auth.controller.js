const { verifyRefreshToken, generateToken } = require("../authorization/jwt");
const authService = require("../services/auth.service");

// 유효성 검사 함수
const isValidId = (id) => {
  // 예: 아이디는 4~20자의 알파벳과 숫자만 허용
  const idRegex = /^[a-zA-Z0-9]{4,20}$/;
  return idRegex.test(id);
};

const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidNickname = (nickname) => {
  return nickname.length <= 8;
};

// 중복 체크
const checkDuplicate = (req, res) => {
  const { field, value } = req.query;

  if (field === "id") {
    authService.checkDuplicateId(value, (err, data) => {
      if (err) {
        console.log(err);
        res.status(409).json(err); // 중복일 경우 409 Conflict로 응답
      } else {
        console.log(data);
        res.status(200).json(data);
      }
    });
  } else if (field === "nickname") {
    authService.checkDuplicateNickname(value, (err, data) => {
      if (err) {
        res.status(409).json(err); // 중복일 경우 409 Conflict로 응답
      } else {
        res.status(200).json(data);
      }
    });
  } else {
    res.status(400).json({ success: false, message: "잘못된 요청입니다." });
  }
};
// 회원가입 컨트롤러
const register = (req, res) => {
  const { id, password, nickname, weight } = req.body;
  if (!isValidId(id)) {
    return res
      .status(400)
      .send({ message: "아이디는 4~20자의 알파벳과 숫자만 허용" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).send({
      message: "비밀번호는 문자/숫자/기호를 사용하여 8자리 이상이여야합니다.",
    });
  }

  if (!isValidNickname(nickname)) {
    return res.status(400).send({ message: "닉네임은 8자 이내여야합니다." });
  }

  // 중복 체크를 먼저 수행하여 중복이 없을 경우에만 회원가입 진행
  authService.checkDuplicateId(id, (err, idExists) => {
    if (err) {
      return res.status(500).send({ message: "아이디 중복 체크 중 오류 발생" });
    }
    if (idExists.message == "아이디가 이미 존재합니다.") {
      return res.status(409).send({ message: "아이디가 이미 존재합니다." });
    }

    authService.checkDuplicateNickname(nickname, (err, nicknameExists) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "닉네임 중복 체크 중 오류 발생" });
      }

      if (nicknameExists.message == "닉네임이 이미 존재합니다.") {
        return res.status(409).send({ message: "닉네임이 이미 존재합니다." });
      }

      // 중복이 없을 경우 회원가입 처리
      authService.register(id, password, nickname, weight, (error, data) => {
        if (error) {
          return res.status(500).send({
            message: error.message || "회원가입 중 에러 발생",
          });
        }
        res.status(201).send(data);
      });
    });
  });
};

// 로그인 컨트롤러
const login = (req, res) => {
  const { id, password } = req.body;

  authService.login(id, password, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "로그인중 오류 발생",
      });
      return;
    }
    res.send(data);
    return;
  });
};

// 회원 삭제 컨트롤러
const deleteUser = async (req, res) => {
  //사용자 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const userId = req.user.user_id;
  try {
    await authService.deleteUser(userId, (err, message) => {
      if (err) {
        return res.status(500).json({ message: "회원 삭제 중 오류 발생" });
      }
      res.status(200).json({ message: message });
    });
  } catch (error) {
    console.error("프로필 수정 중 오류 발생", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken, userId } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: "리프레쉬 토큰이 없습니다." });
  }
  if (!refreshToken.includes(refreshToken)) {
    return res
      .status(403)
      .json({ message: "유효하지 않은 리프레쉬 토큰 입니다." });
  }
  const decoded = verifyRefreshToken(refreshToken);
  if (decoded) {
    const accesstoken = generateToken({ user_id: userId });
    return res.json({ accesstoken: accesstoken });
  } else {
    return res.status(403).json("리프레쉬 토큰 검증 실패");
  }
};

module.exports = { register, login, checkDuplicate, deleteUser, refreshToken };
