import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    encryptedText: {
      type: String,
      required: true,
    },

    iv: {
      type: String,
      required: true,
    },

    analysis: {
      score: {
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
    },
  },

  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
