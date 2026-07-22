import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    speaker: {
      type: String,
      enum: ["AI", "USER", "SYSTEM"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    questionNumber: {
      type: Number,
      default: null,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const reviewSchema = new mongoose.Schema(
  {
    overallScore: {
      type: Number,
      default: 0,
    },

    technicalScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    hiringDecision: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["Technical", "HR", "Behavioral", "Mixed"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    language: {
      type: String,
      default: "",
    },

    mode: {
      type: String,
      enum: ["Text", "Voice"],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Abandoned"],
      default: "Active",
    },

    currentQuestion: {
      type: Number,
      default: 1,
    },

    conversation: {
      type: [messageSchema],
      default: [],
    },

    review: {
      type: reviewSchema,
      default: () => ({}),
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
