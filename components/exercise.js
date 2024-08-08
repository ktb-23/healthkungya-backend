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
  GetExercise: {
    type: "array",
    items: {
      type: "object",
      properties: {
        log_id: {
          type: "integer",
        },
        user_id: {
          type: "integer",
        },
        date_id: {
          type: "integer",
        },
        ex: {
          type: "string",
        },
        extime: {
          type: "string",
        },
        kcal_delete: {
          type: "integer",
        },
      },
    },
    required: ["log_id", "user_id", "date_id", "ex", "extime", "kcal_delete"],
  },
  GetExercise: {
    type: "array",
    items: {
      type: "object",
      properties: {
        log_id: {
          type: "integer",
        },
        user_id: {
          type: "integer",
        },
        date_id: {
          type: "integer",
        },
        ex: {
          type: "string",
        },
        extime: {
          type: "string",
        },
        kcal_delete: {
          type: "integer",
        },
      },
    },
    required: ["log_id", "user_id", "date_id", "ex", "extime", "kcal_delete"],
  },
  SearchExercise: {
    type: "object",
    properties: {
      exitem_id: {
        type: "integer",
        example: 1,
      },
      ex: {
        type: "string",
        example: "바벨스쿼트",
      },
      met: {
        type: "float",
        example: 6,
      },
    },
    required: ["exitem_id", "ex", "met"],
  },
};
