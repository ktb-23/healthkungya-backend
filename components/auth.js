module.exports = {
  UserSignup: {
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "ktb23",
      },
      password: {
        type: "string",
        example: "!ktb1234",
      },
      nickname: {
        type: "string",
        example: "닉네임",
      },
      weight: {
        type: "float",
        example: "68",
      },
    },
    required: ["id", "password", "nickname", "weight"],
  },
  UserLogin: {
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "ktb23",
      },
      password: {
        type: "string",
        example: "!ktb1234",
      },
    },
    required: ["id", "password"],
  },
};
