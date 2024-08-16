const profileService = require("../services/profile.service");

//프로필 수정 컨트롤러
const UpdateProfileController = async (req, res) => {
  // 사용자가 로그인하지 않은 경우 처리
  if (!req.user) {
    res.status(401).json({ message: "인증 권한 없음" });
    return;
  }
  const { profile_id, id, nickname, statusMessage } = req.body;
  const userId = req.user.user_id;
  try {
    await profileService.UpdateProfileService(
      profile_id,
      userId,
      id,
      nickname,
      statusMessage,
      (err, message) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "프로필 수정 중 오류 발생", error: err });
        }
        return res.status(200).json({ message: message });
      }
    );
  } catch (error) {
    console.error("프로필 수정 중 오류 발생", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
};
module.exports = {
  UpdateProfileController,
};
