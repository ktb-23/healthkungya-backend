module.exports = {
  SaveWeight: {
    type: "object",
    properties: {
      date: {
        type: "string",
        example: "2024-08-17",
      },
      weight: {
        type: "float",
        example: "68",
      },
    },
    required: ["date", "weight"],
  },
  UpdateWeight: {
    type: "object",
    properties: {
      weight: {
        type: "float",
        example: "68",
      },
    },
    required: ["weight"],
  },
  GetWeight: {
    type: "object",
    properties: {
      weight_id: {
        type: "integer",
      },
      user_id: {
        type: "integer",
      },
      date_id: {
        type: "integer",
      },
      weight: {
        type: "float",
        example: "68",
      },
    },
    required: ["weight_id", "user_id", "date_id", "weight"],
  },
};
