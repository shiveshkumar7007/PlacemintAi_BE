import Problem from "../models/Problem.js";
import UserProblemProgress from "../models/UserProblemProgress.js";
import DSAStats from "../models/DSAStats.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProblems = asyncHandler(async (req, res) => {
  const {
    search,
    company,
    difficulty,
    topic,
    page = 1,
    limit = 20,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        primaryTopic: {
          $regex: search,
          $options: "i",
        },
      },
      {
        topics: {
          $regex: search,
          $options: "i",
        },
      },
      {
        companies: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (company) {
    query.companies = company;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  if (topic) {
    query.$or = [
      {
        primaryTopic: topic,
      },
      {
        topics: topic,
      },
    ];
  }

  const skip = (page - 1) * limit;

  const problems = await Problem.find(query)
    .sort({
      title: 1,
    })
    .skip(skip)
    .limit(Number(limit));

  const totalProblems = await Problem.countDocuments(query);

  res.status(200).json({
    success: true,

    currentPage: Number(page),

    totalPages: Math.ceil(totalProblems / limit),

    totalProblems,

    problems,
  });
});

export const getProblemDetails = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  let progress = await UserProblemProgress.findOne({
    user: req.user._id,
    problem: problem._id,
  });

  if (!progress) {
    progress = {
      status: "Not Started",
      attempts: 0,
      important: false,
      notes: "",
      solvedAt: null,
    };
  }

  res.status(200).json({
    success: true,

    problem,

    progress,
  });
});

export const updateProblemProgress = asyncHandler(async (req, res) => {
  const { status, attempts, important, notes } = req.body;

  const problem = await Problem.findById(req.params.problemId);

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  let progress = await UserProblemProgress.findOne({
    user: req.user._id,
    problem: problem._id,
  });

  const oldStatus = progress?.status || "Not Started";
  const oldImportant = progress?.important || false;

  if (!progress) {
    progress = await UserProblemProgress.create({
      user: req.user._id,
      problem: problem._id,
    });
  }

  if (status !== undefined) {
    progress.status = status;

    if (status === "Solved" && !progress.solvedAt) {
      progress.solvedAt = new Date();
    }

    if (status !== "Solved") {
      progress.solvedAt = null;
    }
  }

  if (attempts !== undefined) {
    progress.attempts = attempts;
  }

  if (important !== undefined) {
    progress.important = important;
  }

  if (notes !== undefined) {
    progress.notes = notes;
  }

  await progress.save();

  // Update Dashboard Stats

  let stats = await DSAStats.findOne({
    user: req.user._id,
  });

  if (!stats) {
    stats = await DSAStats.create({
      user: req.user._id,
    });
  }

  // User solved for first time

  if (oldStatus !== "Solved" && progress.status === "Solved") {
    stats.totalSolved++;

    if (problem.difficulty === "Easy") {
      stats.easySolved++;
    }

    if (problem.difficulty === "Medium") {
      stats.mediumSolved++;
    }

    if (problem.difficulty === "Hard") {
      stats.hardSolved++;
    }
  }

  // User changed solved back

  if (oldStatus === "Solved" && progress.status !== "Solved") {
    stats.totalSolved--;

    if (problem.difficulty === "Easy") {
      stats.easySolved--;
    }

    if (problem.difficulty === "Medium") {
      stats.mediumSolved--;
    }

    if (problem.difficulty === "Hard") {
      stats.hardSolved--;
    }
  }

  // Important Toggle

  if (!oldImportant && progress.important) {
    stats.importantCount++;
  }

  if (oldImportant && !progress.important) {
    stats.importantCount--;
  }

  // Prevent Negative Counts

  stats.totalSolved = Math.max(stats.totalSolved, 0);
  stats.easySolved = Math.max(stats.easySolved, 0);
  stats.mediumSolved = Math.max(stats.mediumSolved, 0);
  stats.hardSolved = Math.max(stats.hardSolved, 0);
  stats.importantCount = Math.max(stats.importantCount, 0);

  await stats.save();

  res.status(200).json({
    success: true,
    message: "Progress updated successfully",
    progress,
    stats,
  });
});

export const getUserStats = asyncHandler(async (req, res) => {
  let stats = await DSAStats.findOne({
    user: req.user._id,
  });

  if (!stats) {
    stats = await DSAStats.create({
      user: req.user._id,
    });
  }

  res.status(200).json({
    success: true,

    stats,
  });
});
