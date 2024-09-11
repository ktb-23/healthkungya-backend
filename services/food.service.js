const connection = require("../db");

// Common function to execute a database query
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// Get the date_id for a given user and date, or insert a new record if it doesn't exist
const getDateId = async (user_id, date) => {
  const checkQuery =
    "SELECT date_id FROM date_tb WHERE user_id = ? AND dateValue = ?";
  const existingDate = await executeQuery(checkQuery, [user_id, date]);

  if (existingDate.length > 0) return existingDate[0].date_id;

  const insertDateQuery =
    "INSERT INTO date_tb (user_id, dateValue) VALUES (?, ?)";
  const result = await executeQuery(insertDateQuery, [user_id, date]);
  return result.insertId;
};

// Save the food image URL to the database
const SavefoodImage = async (user_id, date, mealtype, imageUrl) => {
  try {
    const date_id = await getDateId(user_id, date);

    const existingLogQuery =
      "SELECT * FROM foodlog_tb WHERE date_id = ? AND user_id = ? AND mealtype=?";
    const existingLog = await executeQuery(existingLogQuery, [
      date_id,
      user_id,
      mealtype,
    ]);

    if (existingLog.length > 0) {
      const updateFoodLogQuery =
        "UPDATE foodlog_tb SET food_photo = ? WHERE date_id = ? AND user_id = ? AND mealtype = ?";
      await executeQuery(updateFoodLogQuery, [
        imageUrl,
        date_id,
        user_id,
        mealtype,
      ]);
      return existingLog[0].foodlog_id;
    }

    const insertFoodLogQuery =
      "INSERT INTO foodlog_tb (date_id, user_id, food_photo, mealtype) VALUES (?, ?, ?,?)";
    const insertResult = await executeQuery(insertFoodLogQuery, [
      date_id,
      user_id,
      imageUrl,
      mealtype,
    ]);

    return insertResult.insertId;
  } catch (error) {
    console.error("음식 이미지 저장 중 오류 발생:", error);
    throw error;
  }
};

const SaveFoodLog = async (userId, foodlog_id, data) => {
  try {
    const updateFoodLogQuery =
      "UPDATE foodlog_tb SET food = ?, kcal = ?, quantity = ? WHERE foodlog_id = ? AND user_id = ?";
    await executeQuery(updateFoodLogQuery, [
      data.food,
      data.kcal,
      data.quantity,
      foodlog_id,
      userId,
    ]);
    return { message: "성공적으로 업데이트 되었습니다." };
  } catch (error) {
    console.error("음식 기록 업데이트 중 오류 발생:", error);
    throw error;
  }
};

const getFoodLog = async (userId, date, mealtype) => {
  const date_id = await getDateId(userId, date);
  try {
    const existingLogQuery =
      "SELECT * FROM foodlog_tb WHERE date_id = ? AND user_id = ? AND mealtype=?";
    const existingLog = await executeQuery(existingLogQuery, [
      date_id,
      userId,
      mealtype,
    ]);
    return existingLog[0];
  } catch (error) {
    console.error("음식 기록 조회 중 오류 발생:", error);
    throw error;
  }
};

const getAllFoodLog = async (userId, date) => {
  const date_id = await getDateId(userId, date);
  try {
    const existingLogQuery =
      "SELECT * FROM foodlog_tb WHERE date_id = ? AND user_id = ?";
    const existingLog = await executeQuery(existingLogQuery, [date_id, userId]);
    console.log(existingLog);
    return existingLog;
  } catch (error) {
    console.error("음식 기록 조회 중 오류 발생:", error);
    throw error;
  }
};
const GetAllDateFoodlog = async (user_id, result) => {
  const query = `
  SELECT dateValue 
  FROM date_tb
  JOIN  foodlog_tb ON foodlog_tb.date_id = date_tb.date_id
  WHERE foodlog_tb.user_id = ?
`;
  try {
    const rows = await executeQuery(query, [user_id]);
    result(null, rows);
  } catch (err) {
    logger.error("전체 음식기록 조회 중 오류", err);
    result(err, null);
  }
};
module.exports = {
  SavefoodImage,
  SaveFoodLog,
  getFoodLog,
  getAllFoodLog,
  GetAllDateFoodlog,
};
