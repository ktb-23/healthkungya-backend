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
            exitem_id: {
              type: "integer",
              example: 1,
            },
            ex: {
              type: "string",
              example: "달리기",
            },
            extime: {
              type: "number",
              example: 30,
            },
            met: {
              type: "float",
              example: 3,
            },
          },
        },
        example: [
          { exitem_id: 1, ex: "달리기", extime: 30, met: 3 },
          { exitem_id: 2, ex: "벤치프레스", extime: 45, met: 4 },
          { exitem_id: 3, ex: "조깅", extime: 20, met: 5 },
        ],
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
            exitem_id: {
              type: "integer",
              example: 1,
            },
            ex: {
              type: "string",
              example: "달리기",
            },
            extime: {
              type: "number",
              example: 30,
            },
            met: {
              type: "float",
              example: 3,
            },
          },
        },
        example: [
          { exitem_id: 5, ex: "스쿼트", extime: 30, met: 3 },
          { exitem_id: 7, ex: "풀업", extime: 45, met: 4 },
          { exitem_id: 8, ex: "바벨로우", extime: 20, met: 5 },
        ],
      },
    },
    required: ["exercises"],
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
      },
    },
    required: ["log_id", "user_id", "date_id", "ex", "extime"],
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
  GetAllExerciseDate: {
    type: "object",
    properties: {
      dateValue: {
        type: "string",
        example: "2024.07.26",
      },
    },
    required: ["dateValue"],
  },
};
