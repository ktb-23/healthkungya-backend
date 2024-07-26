module.exports = {
  SaveExercise: {
    type: "object",
    properties: {
      date: {
        type: "string",
        example: "2024.07.26",
      },
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ex: {
              type: "string",
              example: "달리기",
            },
            extime: {
              type: "number",
              example: 30,
            },
          },
        },
        example: [
          { ex: "달리기", extime: 30 },
          { ex: "벤치프레스", extime: 45 },
          { ex: "조깅", extime: 20 },
        ],
      },
      kcal_delete: {
        type: "number",
        example: 2150,
      },
    },
    required: ["date", "exercises", "kcal_delete"],
  },
  UpdateExercise: {
    type: "object",
    properties: {
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ex: {
              type: "string",
              example: "달리기",
            },
            extime: {
              type: "number",
              example: 30,
            },
          },
        },
        example: [
          { ex: "달리기", extime: 30 },
          { ex: "벤치프레스", extime: 45 },
          { ex: "조깅", extime: 20 },
        ],
      },
      kcal_delete: {
        type: "number",
        example: 1500,
      },
    },
    required: ["exercises", "kcal_delete"],
  },
};
