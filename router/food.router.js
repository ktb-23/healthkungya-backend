const express = require("express");
const router = express.Router();
const db = require("../db.js");
const util = require("util");
const uploadFoodImage = require("../module/uploadfood"); // multer 설정을 내보내는 파일

// 프로미스 기반 쿼리 함수 생성
const query = util.promisify(db.query).bind(db);

router.post("/uploadImage", uploadFoodImage.single("file"), (req, res) => {
  console.log("진입");
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ imageUrl: req.file.location });
});

// 식사 정보 저장 API
router.post("/saveFoodLog", async (req, res) => {
  const { userId, date, mealType, foodName, calories, food_photo, quantity } =
    req.body;

  try {
    // 1. date_tb에 날짜 저장 (이미 존재하면 가져오기)
    const dateRows = await query(
      "INSERT INTO date_tb (user_id, dateValue) VALUES (?, ?) ON DUPLICATE KEY UPDATE date_id=LAST_INSERT_ID(date_id)",
      [userId, date]
    );
    const dateId = dateRows.insertId;

    // 2. food_tb에 음식 저장 (이미 존재하면 가져오기)
    const foodRows = await query(
      "INSERT INTO food_tb (food) VALUES (?) ON DUPLICATE KEY UPDATE food_id=LAST_INSERT_ID(food_id)",
      [foodName]
    );
    const foodId = foodRows.insertId;

    // 3. foodlog_tb에 로그 저장 또는 업데이트
    await query(
      `INSERT INTO foodlog_tb (date_id, user_id, food_id, mealtype, food, kcal, quantity, food_photo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       kcal = kcal + VALUES(kcal),
       quantity = quantity + VALUES(quantity),
       food_photo = COALESCE(food_photo, VALUES(food_photo))`,
      [
        dateId,
        userId,
        foodId,
        mealType,
        foodName,
        calories,
        quantity,
        food_photo,
      ]
    );

    res.status(200).json({ message: "Food log saved successfully" });
  } catch (error) {
    console.error("Error saving food log:", error);
    res.status(500).json({ error: "Error saving food log" });
  }
});

// 식사 정보 조회 API
router.get("/getFoodLog", async (req, res) => {
  const { userId, date } = req.query;

  try {
    const rows = await query(
      `SELECT f.mealtype, f.food, f.kcal, f.quantity, f.food_photo 
       FROM foodlog_tb f 
       JOIN date_tb d ON f.date_id = d.date_id 
       WHERE d.user_id = ? AND d.dateValue = ?`,
      [userId, date]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error getting food log:", error);
    res.status(500).json({ error: "Error getting food log" });
  }
});

module.exports = router;
