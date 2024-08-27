const exerciseService = require("../services/exercise.service");

const SaveExerciseLogController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const body = req.body;
  const userId = req.user.user_id;

  try {
    // 운동 기록 저장 서비스 호출
    await exerciseService.SaveExerciseLog(userId, body, (err, message) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "운동 기록 저장 중 오류 발생", error: err });
      }
      return res.status(200).json({ message: message });
    });
  } catch (error) {
    console.error("운동 기록 저장 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};

const UpdateExerciseLogController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const { log_id } = req.params;
  const body = req.body;
  const userId = req.user.user_id;
  try {
    // 운동 기록 업데이트 서비스 호출
    await exerciseService.UpdateExerciseLog(
      parseInt(log_id),
      userId,
      body,
      (err, message) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "운동 기록 업데이트 중 오류 발생", error: err });
        }
        return res.status(200).json({ message: message });
      }
    );
  } catch (error) {
    console.error("운동 기록 업데이트 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};

// 운동 기록 조회
const GetExerciseLogController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const { dateValue } = req.params;
  const userId = req.user.user_id;
  try {
    // 운동 기록 조회 서비스 호출
    await exerciseService.GetExerciseLog(dateValue, userId, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "운동 기록 조회 중 오류 발생", error: err });
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    console.error("운동 기록 조회 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};

// 운동 검색
const GetSearchExerciseController = async (req, res) => {
  const ex = req.query.type;
  if (!ex) {
    return res.status(400).json({ error: "운동 종목을 입력하세요" });
  }

  try {
    await exerciseService.SearchExercise(ex, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "운동 조회 중 오류 발생", error: err });
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    console.error("운동 조회 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};

// 운동기록 삭제
const DeleteExerciseLogController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }

  const { log_id, date_id } = req.params;
  const userId = req.user.user_id;

  try {
    // 운동 기록 삭제 서비스 호출
    await exerciseService.deleteExerciseLog(
      parseInt(log_id),
      parseInt(date_id),
      userId,
      (err, message) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "운동 기록 삭제 중 오류 발생", error: err });
        }
        return res.status(200).json({ message: message });
      }
    );
  } catch (error) {
    console.error("운동 기록 삭제 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};

// 전체 운동기록 조회
const GetAllDateExlogLogController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const userId = req.user.user_id;
  try {
    await exerciseService.GetAllDateExlog(userId, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "전체 운동기록 조회 중 오류 발생", error: err });
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    console.error("전체 운동기록 조회 중 오류 발생", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};

module.exports = {
  SaveExerciseLogController,
  UpdateExerciseLogController,
  GetExerciseLogController,
  GetSearchExerciseController,
  DeleteExerciseLogController,
  GetAllDateExlogLogController,
};
