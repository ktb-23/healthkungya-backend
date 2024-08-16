module.exports = {
  ProfileUpdate: {
    type: "object",
    properties: {
      profile_id: {
        type: "string",
        example: "1",
      },
      id: {
        type: "string",
        example: "ktb23",
      },
      nickname: {
        type: "string",
        example: "ktb23",
      },
      statusMessage: {
        type: "string",
        example: "건강 쿵야 프로젝트 달려 보자!",
      },
    },
    required: ["profile_id", "id", "nickname", "statusMessage"],
  },
};
