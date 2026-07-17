import mongoose from "mongoose";

const daySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    topics: {
      type: [String],
      default: [],
    },

    tasks: {
      type: [String],
      default: [],
    },

    revisionNotes: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    targetDays: {
      type: Number,
      required: true,
    },

    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    dailyStudyHours: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ABANDONED"],
      default: "ACTIVE",
    },

    roadmap: {
      type: [daySchema],
      default: [],
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    abandonedAt: {
      type: Date,
      default: null,
    },

    abandonReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
