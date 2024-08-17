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

// 몸무게 삽입 서비스
const saveWeight = async (user_id, body, result) => {
  try {
    const date_id = await getDateId(user_id, body.date);

    // 만약 date_id가 이미 존재하는 경우, 운동 기록이 이미 존재한다고 알림
    const existingLogQuery =
      "SELECT * FROM weight_tb WHERE date_id = ? AND user_id = ?";
    const existingLog = await executeQuery(existingLogQuery, [
      date_id,
      user_id,
    ]);

    if (existingLog.length > 0) {
      return result(null, "해당 날짜에 대한 기록이 이미 존재합니다.");
    }

    // weight_tb에 몸무게 삽입
    const insertWeightQuery =
      "INSERT INTO weight_tb (date_id, user_id, weight) VALUES (?,?,?)";
    await executeQuery(insertWeightQuery, [date_id, user_id, body.weight]);

    // user_tb의 weight 업데이트
    const updateUserWeightQuery =
      "UPDATE user_tb SET weight = ? WHERE user_id = ?";
    await executeQuery(updateUserWeightQuery, [body.weight, user_id]);

    result(null, "몸무게가 성공적으로 삽입되었습니다.");
  } catch (err) {
    logger.error("몸무게 삽입 중 오류 발생:", err); // 로거 사용
    result(err, null);
  }
};

// 운동 기록 업데이트
const updateWeight = async (weight_id, user_id, body, result) => {
  const updateQuery =
    "UPDATE weight_tb SET weight = ? WHERE weight_id = ? AND user_id = ?";

  // user_tb의 weight 업데이트
  const updateUserWeightQuery =
    "UPDATE user_tb SET weight = ? WHERE user_id = ?";

  try {
    // weight_tb 업데이트
    await executeQuery(updateQuery, [body.weight, weight_id, user_id]);
    await executeQuery(updateUserWeightQuery, [body.weight, user_id]);
    result(null, "몸무게를 성공적으로 업데이트되었습니다.");
  } catch (err) {
    logger.error("몸무게 업데이트 중 오류 발생:", err);
    result(err, null);
  }
};

module.exports = { saveWeight, updateWeight };
