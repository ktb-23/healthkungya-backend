const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, errors } = format;

// 로그 포맷 정의
const logFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label}] ${level}: ${stack || message}`;
});

// 로거 생성
const logger = createLogger({
  level: "info", // 로그 레벨 설정
  format: combine(
    label({ label: "exercise-service" }), // 레이블 추가
    timestamp(), // 타임스탬프 추가
    errors({ stack: true }), // 에러 스택 로깅
    logFormat // 사용자 정의 포맷 적용
  ),
  transports: [
    new transports.Console(), // 콘솔에 출력
    new transports.File({ filename: "logs/error.log", level: "error" }), // 에러 로그 파일 저장
    new transports.File({ filename: "logs/combined.log" }), // 모든 로그 파일 저장
  ],
});

module.exports = logger;
