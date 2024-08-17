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
};
