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

//일주일 데이터 조회
const getWeeklyExerciseData = async (user_id, date_id, result) => {
  const weeklyQuery = `
      SELECT 
        DAYNAME(date_tb.dateValue) AS day, 
        SUM(exlog_tb.extime * exlog_tb.met * user_tb.weight) AS totalCalories
      FROM 
        exlog_tb 
      JOIN 
        date_tb ON exlog_tb.date_id = date_tb.date_id
      JOIN 
        user_tb ON exlog_tb.user_id = user_tb.user_id
      WHERE 
        date_tb.user_id = ? 
        AND WEEK(date_tb.dateValue) = WEEK((SELECT dateValue FROM date_tb WHERE date_id = ?))
      GROUP BY 
        day
      ORDER BY 
        FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    `;

  try {
    const weeklyData = await executeQuery(weeklyQuery, [user_id, date_id]);
    result(null, weeklyData);
  } catch (error) {
    console.error("요일별 운동 데이터 조회 중 오류 발생:", error);
    result(error, null);
  }
};

module.exports = {
  getWeeklyExerciseData,
};
