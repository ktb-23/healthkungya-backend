module.exports = {
    UserSignup: {
      type: "object",
      properties: {
        username: {
          type: "string",
          example: "sgky0511@naver.com",
        },
        password: {
          type: "string",
          example: "hello1234",
        },
      },
      required: ["username", "password"],
    },
    UserLogin: {
      type: "object",
      properties: {
        username: {
          type: "string",
          example: "sgky0511@naver.com",
        },
        password: {
          type: "string",
          example: "hello1234",
        },
      },
      required: ["username", "password"],
    },
    UserProfile: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                example: 1,
            },
            username: {
                type: "string",
                example: "user1",
            },
            email: {
                type: "string",
                example: "user1@example.com",
            },
        },
        required: ["id", "username", "email"],
    },
  };