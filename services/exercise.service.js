const logger = require("../logger/logger");
const connection = require("../db");

// 공통 쿼리 실행 함수
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// 날짜 ID를 가져오거나, 새로 삽입하는 함수
const getDateId = async (user_id, date) => {
  const checkQuery =
    "SELECT date_id FROM date_tb WHERE user_id = ? AND dateValue = ?";
  const existingDate = await executeQuery(checkQuery, [user_id, date]);

  // 날짜가 이미 존재하는 경우 date_id 반환
  if (existingDate.length > 0) return existingDate[0].date_id;

  // 날짜가 존재하지 않으면 새로운 date_id 생성
  const insertDateQuery =
    "INSERT INTO date_tb (user_id, dateValue) VALUES (?, ?)";
  const result = await executeQuery(insertDateQuery, [user_id, date]);
  return result.insertId;
};

// 운동 데이터를 포맷하는 함수
const formatExerciseData = (exercises) => {
  return {
    exitem_idString: exercises.map((exercise) => exercise.exitem_id).join(", "),
    exercisesString: exercises.map((exercise) => exercise.ex).join(", "),
    extimesString: exercises.map((exercise) => exercise.extime).join(", "),
    metString: exercises.map((exercise) => exercise.met).join(", "),
  };
};

// 운동 기록 작성 서비스
const SaveExerciseLog = async (user_id, body, result) => {
  try {
    const date_id = await getDateId(user_id, body.date);

    // 만약 date_id가 이미 존재하는 경우, 운동 기록이 이미 존재한다고 알림
    const existingLogQuery =
      "SELECT * FROM exlog_tb WHERE date_id = ? AND user_id = ?";
    const existingLog = await executeQuery(existingLogQuery, [
      date_id,
      user_id,
    ]);

    if (existingLog.length > 0) {
      return result(null, "해당 날짜에 대한 기록이 이미 존재합니다.");
    }

    const { exitem_idString, exercisesString, extimesString, metString } =
      formatExerciseData(body.exercises);

    const insertExLogQuery =
      "INSERT INTO exlog_tb (date_id, user_id, exitem_id, ex, extime, met) VALUES (?, ?, ?, ?, ?, ?)";
    await executeQuery(insertExLogQuery, [
      date_id,
      user_id,
      exitem_idString,
      exercisesString,
      extimesString,
      metString,
    ]);

    result(null, "운동 기록이 성공적으로 삽입되었습니다.");
  } catch (err) {
    logger.error("운동 기록 작성 중 오류 발생:", err); // 로거 사용
    result(err, null);
  }
};

// 운동 기록 조회 (JOIN을 사용하여 date_id를 가져와 바로 운동 기록 조회)
const GetExerciseLog = async (dateValue, user_id, result) => {
  // date_tb와 exlog_tb를 JOIN하여 dateValue와 user_id로 운동 기록을 조회하는 쿼리
  const query = `
    SELECT exlog_tb.* 
    FROM exlog_tb
    JOIN date_tb ON exlog_tb.date_id = date_tb.date_id
    WHERE date_tb.dateValue = ? AND exlog_tb.user_id = ?
  `;

  try {
    // JOIN을 사용하여 한 번에 필요한 데이터를 조회
    const log = await executeQuery(query, [dateValue, user_id]);

    if (log.length === 0) {
      return result(null, "해당 날짜에 대한 운동 기록이 존재하지 않습니다.");
    }

    result(null, log);
  } catch (error) {
    console.error("운동 기록 조회 중 오류 발생:", error);
    result(error, null);
  }
};

// 운동 기록 업데이트
const UpdateExerciseLog = async (log_id, user_id, body, result) => {
  const updateQuery =
    "UPDATE exlog_tb SET exitem_id=?, ex = ?, extime = ?, met= ? WHERE log_id = ? AND user_id = ?";

  const { exitem_idString, exercisesString, extimesString, metString } =
    formatExerciseData(body.exercises);

  try {
    await executeQuery(updateQuery, [
      exitem_idString,
      exercisesString,
      extimesString,
      metString,
      log_id,
      user_id,
    ]);
    result(null, "운동 기록이 성공적으로 업데이트되었습니다.");
  } catch (err) {
    logger.error("운동 기록 업데이트 중 오류 발생:", err);
    result(err, null);
  }
};

// 운동 검색
const SearchExercise = async (ex, result) => {
  const searchQuery = "SELECT exitem_id, ex, met FROM ex_tb WHERE ex LIKE ?";
  try {
    const rows = await executeQuery(searchQuery, [`%${ex}%`]);
    result(null, rows);
  } catch (err) {
    logger.error("운동 검색 중 오류 발생:", err);
    result(err, null);
  }
};

// 운동 기록 삭제
const deleteExerciseLog = async (log_id, date_id, user_id, result) => {
  const deleteExLogQuery =
    "DELETE FROM exlog_tb WHERE log_id = ? AND user_id = ?";
  const checkRemainingLogsQuery =
    "SELECT COUNT(*) as count FROM exlog_tb WHERE date_id = ?";
  const deleteDateQuery =
    "DELETE FROM date_tb WHERE date_id = ? AND user_id = ?";

  try {
    // 1. 운동 기록 삭제
    await executeQuery(deleteExLogQuery, [log_id, user_id]);

    // 2. 해당 날짜에 다른 운동 기록이 남아있는지 확인
    const remainingLogs = await executeQuery(checkRemainingLogsQuery, [
      date_id,
    ]);

    // 3. 다른 운동 기록이 없으면 date_tb에서 날짜 삭제
    if (remainingLogs[0].count === 0) {
      await executeQuery(deleteDateQuery, [date_id, user_id]);
    }

    result(null, "운동 기록이 성공적으로 삭제되었습니다.");
  } catch (err) {
    logger.error("운동 기록 삭제 중 오류 발생:", err);
    result(err, null);
  }
};
const GetAllDateExlog = async (user_id, result) => {
  const query = `
  SELECT dateValue 
  FROM date_tb
  JOIN exlog_tb ON exlog_tb.date_id = date_tb.date_id
  WHERE exlog_tb.user_id = ?
`;
  try {
    const rows = await executeQuery(query, [user_id]);
    result(null, rows);
  } catch (err) {
    logger.error("전체 운동기록 조회 중 오류", err);
    result(err, null);
  }
};
module.exports = {
  SaveExerciseLog,
  UpdateExerciseLog,
  GetExerciseLog,
  SearchExercise,
  deleteExerciseLog,
  GetAllDateExlog,
};
