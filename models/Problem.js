import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    primaryTopic: {
      type: String,
      required: true,
    },

    topics: {
      type: [String],
      default: [],
    },

    companies: {
      type: [String],
      default: [],
    },

    frequency: {
      type: Number,
      default: 0,
    },

    problemLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// ---------- Indexes ----------

problemSchema.index({ title: "text" });

problemSchema.index({ difficulty: 1 });

problemSchema.index({ primaryTopic: 1 });

problemSchema.index({ companies: 1 });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
