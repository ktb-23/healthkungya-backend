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

// 프로필 수정 서비스
const UpdateProfileService = async (
  profile_id,
  user_id,
  id,
  name,
  statusMessage,
  result
) => {
  // 프로필 테이블 업데이트 쿼리
  const updateProfileQuery =
    "UPDATE profile_tb SET statusMessage=? WHERE profile_id = ? AND user_id = ?";

  // 유저 테이블 업데이트 쿼리
  const updateUserQuery = "UPDATE user_tb SET nickname=?, id=? WHERE user_id=?";
  try {
    // profile_tb 업데이트
    await executeQuery(updateProfileQuery, [
      statusMessage,
      profile_id,
      user_id,
    ]);

    // user_tb 업데이트
    await executeQuery(updateUserQuery, [name, id, user_id]);
    result(null, { message: "프로필 및 이름 수정 성공" });
  } catch (error) {
    console.error("프로필 및 이름 수정 중 에러 발생", error);
    result(error, null);
  }
};
module.exports = {
  UpdateProfileService,
};
