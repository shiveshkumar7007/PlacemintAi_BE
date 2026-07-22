import mongoose from "mongoose";

const userProblemProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Solved"],
      default: "Not Started",
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    important: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// A user can have only one progress document per problem
userProblemProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

// Useful indexes
userProblemProgressSchema.index({ status: 1 });

userProblemProgressSchema.index({ important: 1 });

const UserProblemProgress = mongoose.model(
  "UserProblemProgress",
  userProblemProgressSchema,
);

export default UserProblemProgress;
