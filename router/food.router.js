const express = require("express");
const uploadFoodImage = require("../module/uploadfood"); // multer 설정을 내보내는 파일
const { verifyTokenMiddleware } = require("../authorization/jwt");
const foodController = require("../controllers/food.controller");
const connection = require("../db");
//라우터
const router = express.Router();
router.post(
  "/image",
  verifyTokenMiddleware,
  uploadFoodImage.single("foodImage"),
  foodController.SaveFoodImageController
);
router.put(
  "/save/:foodlog_id",
  verifyTokenMiddleware,
  foodController.SaveFoodLog
);
router.get("/", verifyTokenMiddleware, foodController.GetFoodLog);
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
router.post("/result", async (req, res) => {
  const result = req.body;
  if (!result.foodlog_id || !result.tag || !result.kcal) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const { foodlog_id, tag, kcal } = result;
  console.log(tag, kcal);

  try {
    // Example of updating the database with the result
    const updateQuery = `
      UPDATE foodlog_tb
      SET food = ?, kcal = ?, status = 'complete'
      WHERE foodlog_id = ?;
    `;
    await executeQuery(updateQuery, [tag, kcal, foodlog_id]);

    console.log("Received result from Flask:", result);

    // Respond to confirm receipt
    res.status(200).json({ message: "Result received successfully" });
  } catch (error) {
    console.error("Error processing result:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/status/:foodlog_id", async (req, res) => {
  const { foodlog_id } = req.params;

  try {
    // Query to get the status of the food log
    const query =
      "SELECT food, kcal, status, food_photo FROM foodlog_tb WHERE foodlog_id = ?";
    const result = await executeQuery(query, [foodlog_id]);

    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ message: "Food log not found" });
    }
  } catch (error) {
    console.error("Error retrieving status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
