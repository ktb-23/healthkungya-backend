const connection = require("../db");

// 운동 기록 작성 서비스
const SaveExerciseLog = async (user_id, body, result) => {
  const checkQuery =
    "SELECT date_id FROM date_tb WHERE user_id = ? AND dateValue = ?";
  const insertDateQuery =
    "INSERT INTO date_tb (user_id, dateValue) VALUES (?, ?)";
  const insertExLogQuery =
    "INSERT INTO exlog_tb (date_id, user_id, ex, extime, kcal_delete) VALUES (?, ?, ?, ?, ?)";

  try {
    // 기록이 이미 존재하는지 확인
    const existingDateId = await new Promise((resolve, reject) => {
      connection.query(checkQuery, [user_id, body.date], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          return resolve(results[0].date_id); // 기존 date_id를 반환
        }
        return resolve(null); // 기록이 없음
      });
    });

    if (existingDateId) {
      // 기록이 이미 존재하는 경우, 사용자에게 알림
      return result(null, "해당 날짜에 대한 기록이 이미 존재합니다.");
    }

    // date_tb에 새 기록 추가
    const newDateId = await new Promise((resolve, reject) => {
      connection.query(insertDateQuery, [user_id, body.date], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.insertId); // 새로 삽입된 date_id 반환
      });
    });

    // 운동명과 시간을 쉼표로 구분된 문자열로 만들기
    const exercisesString = body.exercises
      .map((exercise) => exercise.ex)
      .join(", ");
    const extimesString = body.exercises
      .map((exercise) => exercise.extime)
      .join(", ");
    // exlog_tb에 운동 기록 추가
    await new Promise((resolve, reject) => {
      connection.query(
        insertExLogQuery,
        [newDateId, user_id, exercisesString, extimesString, body.kcal_delete],
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    });

    // 성공
    result(null, "운동 기록이 성공적으로 삽입되었습니다.");
  } catch (err) {
    // 에러 처리
    console.error("오류 발생:", err);
    result(err, null);
  }
};

const GetExerciseLog = async (date_id, user_id, result) => {
  const getQuery = "SELECT * FROM exlog_tb WHERE date_id = ? AND user_id = ?";

  try {
    const log = await new Promise((resolve, reject) => {
      connection.query(getQuery, [date_id, user_id], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
    result(log);
  } catch (error) {
    console.error("운동 기록 조회 중 오류 발생:", error);
    result(error, null);
  }
};

const UpdateExerciseLog = async (log_id, user_id, body, result) => {
  const updateQuery =
    "UPDATE exlog_tb SET ex = ?, extime = ?, kcal_delete = ? WHERE log_id = ? AND user_id = ?";
  // 운동명과 시간을 쉼표로 구분된 문자열로 만들기
  const exercisesString = body.exercises
    .map((exercise) => exercise.ex)
    .join(", ");
  const extimesString = body.exercises
    .map((exercise) => exercise.extime)
    .join(", ");
  // exlog_tb에 운동 기록 업데이트

  try {
    await new Promise((resolve, reject) => {
      connection.query(
        updateQuery,
        [exercisesString, extimesString, body.kcal_delete, log_id, user_id],
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
    // 성공
    result(null, "운동 기록이 성공적으로 업데이트되었습니다.");
  } catch (err) {
    // 에러 처리
    console.error("운동 기록 업데이트 중 오류 발생:", err);
    result(err, null);
  }
};

module.exports = { SaveExerciseLog, UpdateExerciseLog, GetExerciseLog };
