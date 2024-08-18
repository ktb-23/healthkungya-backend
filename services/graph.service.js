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

// 칼로리 계산 함수
const calculateCalories = (metArray, extimeArray, weight) => {
  let totalCalories = 0;

  for (let i = 0; i < metArray.length; i++) {
    const met = parseFloat(metArray[i].trim());
    const extime = parseFloat(extimeArray[i].trim());
    totalCalories += ((met * weight * 3.5) / 200) * extime;
  }

  return totalCalories;
};

const getKoreanDayName = (day) => {
  const daysOfWeek = {
    Sunday: "일요일",
    Monday: "월요일",
    Tuesday: "화요일",
    Wednesday: "수요일",
    Thursday: "목요일",
    Friday: "금요일",
    Saturday: "토요일",
  };
  return daysOfWeek[day] || day;
};

// 주간 운동 데이터 조회 및 칼로리 계산
const getWeeklyExerciseData = async (user_id, dateValue, result) => {
  const weeklyQuery = `
    SELECT 
      date_tb.dateValue AS date,
      DAYNAME(date_tb.dateValue) AS day, 
      DAYOFWEEK(date_tb.dateValue) AS dayOfWeek,
      exlog_tb.met, 
      exlog_tb.extime,
      user_tb.weight
    FROM 
      exlog_tb 
    JOIN 
      date_tb ON exlog_tb.date_id = date_tb.date_id
    JOIN 
      user_tb ON exlog_tb.user_id = user_tb.user_id
    WHERE 
      date_tb.user_id = ? 
      AND YEARWEEK(date_tb.dateValue, 1) = YEARWEEK(?, 1)
    ORDER BY 
      DAYOFWEEK(date_tb.dateValue);
  `;

  try {
    const weeklyData = await executeQuery(weeklyQuery, [user_id, dateValue]);

    // 요일별 칼로리 집계
    const weeklyCalories = {};

    weeklyData.forEach((record) => {
      const { date, day, dayOfWeek, met, extime, weight } = record;

      // MET과 운동 시간을 배열로 변환
      const metArray = met.split(",");
      const extimeArray = extime.split(",");

      // 칼로리 계산
      const totalCalories = calculateCalories(metArray, extimeArray, weight);

      // 요일별로 칼로리 집계
      if (!weeklyCalories[day]) {
        weeklyCalories[day] = {
          date: date,
          totalCalories: 0,
        };
      }
      weeklyCalories[day].totalCalories += totalCalories;
    });

    // 결과를 배열로 변환
    const resultArray = Object.keys(weeklyCalories).map((day) => ({
      day: getKoreanDayName(day), // 요일을 한글로 변환
      date: weeklyCalories[day].date, // 날짜
      totalCalories: weeklyCalories[day].totalCalories,
    }));

    result(null, resultArray);
  } catch (error) {
    console.error("요일별 운동 데이터 조회 중 오류 발생:", error);
    result(error, null);
  }
};
const getWeeklyWeightData = async (user_id, dateValue, result) => {
  const weeklyQuery = `
  SELECT 
    date_tb.dateValue AS date,
    DAYNAME(date_tb.dateValue) AS day, 
    DAYOFWEEK(date_tb.dateValue) AS dayOfWeek,
    weight_tb.weight
  FROM 
    weight_tb
  JOIN 
    date_tb ON weight_tb.date_id = date_tb.date_id
  JOIN 
    user_tb ON weight_tb.user_id = user_tb.user_id
  WHERE 
    date_tb.user_id = ? 
    AND YEARWEEK(date_tb.dateValue, 1) = YEARWEEK(?, 1)
  ORDER BY 
    DAYOFWEEK(date_tb.dateValue);
  `;
  try {
    const weeklyData = await executeQuery(weeklyQuery, [user_id, dateValue]);

    // 쿼리 결과가 정상적으로 반환되었는지 확인
    if (!weeklyData || weeklyData.length === 0) {
      return result(null, "해당 주차에 대한 몸무게 데이터가 없습니다.");
    }

    result(null, weeklyData);
  } catch (error) {
    // 오류 로그 상세히 출력
    console.error("몸무게 데이터 조회 중 오류 발생:", error);
    result(error, null);
  }
};

module.exports = {
  getWeeklyExerciseData,
  getWeeklyWeightData,
};
