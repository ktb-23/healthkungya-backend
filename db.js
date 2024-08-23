const mysql = require("mysql2");
const dbConfig = require("./config/db.config");

// MySQL 연결 생성
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT // 포트 명시적 설정
});

// MySQL 연결 테스트
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;
