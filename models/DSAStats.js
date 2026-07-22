import mongoose from "mongoose";

const dsaStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    totalSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    easySolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    mediumSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    hardSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    importantCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const DSAStats = mongoose.model("DSAStats", dsaStatsSchema);

export default DSAStats;
