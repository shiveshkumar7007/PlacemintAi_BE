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
    status, // Extracted status
    page = 1,
    limit = 20,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { primaryTopic: { $regex: search, $options: "i" } },
      { topics: { $regex: search, $options: "i" } },
      { companies: { $regex: search, $options: "i" } },
    ];
  }

  if (company) {
    query.companies = company;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  if (topic) {
    query.$or = [{ primaryTopic: topic }, { topics: topic }];
  }

  // Handle Custom Status/Important Filtering
  if (status) {
    if (status === "Solved") {
      const solvedProgress = await UserProblemProgress.find({
        user: req.user._id,
        status: "Solved",
      }).select("problem");
      const solvedIds = solvedProgress.map((p) => p.problem);
      query._id = { $in: solvedIds };
    } else if (status === "Important") {
      const importantProgress = await UserProblemProgress.find({
        user: req.user._id,
        important: true,
      }).select("problem");
      const importantIds = importantProgress.map((p) => p.problem);
      query._id = { $in: importantIds };
    } else if (status === "Unsolved") {
      const solvedProgress = await UserProblemProgress.find({
        user: req.user._id,
        status: "Solved",
      }).select("problem");
      const solvedIds = solvedProgress.map((p) => p.problem);
      query._id = { $nin: solvedIds };
    }
  }

  const skip = (page - 1) * Number(limit);

  const problems = await Problem.find(query)
    .sort({ title: 1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const totalProblems = await Problem.countDocuments(query);

  const progress = await UserProblemProgress.find({
    user: req.user._id,
    problem: {
      $in: problems.map((p) => p._id),
    },
  }).lean();

  const progressMap = {};
  progress.forEach((item) => {
    progressMap[item.problem.toString()] = item;
  });

  const mergedProblems = problems.map((problem) => {
    const p = progressMap[problem._id.toString()];
    return {
      ...problem,
      status: p?.status || "Not Started",
      important: p?.important || false,
      attempts: p?.attempts || 0,
    };
  });

  res.status(200).json({
    success: true,
    currentPage: Number(page),
    totalPages: Math.ceil(totalProblems / Number(limit)),
    totalProblems,
    problems: mergedProblems,
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
  let stats = await DSAStats.findOne({ user: req.user._id });
  if (!stats) {
    stats = await DSAStats.create({ user: req.user._id });
  }

  // User solved for first time
  if (oldStatus !== "Solved" && progress.status === "Solved") {
    stats.totalSolved++;
    if (problem.difficulty === "Easy") stats.easySolved++;
    if (problem.difficulty === "Medium") stats.mediumSolved++;
    if (problem.difficulty === "Hard") stats.hardSolved++;
  }

  // User changed solved back
  if (oldStatus === "Solved" && progress.status !== "Solved") {
    stats.totalSolved--;
    if (problem.difficulty === "Easy") stats.easySolved--;
    if (problem.difficulty === "Medium") stats.mediumSolved--;
    if (problem.difficulty === "Hard") stats.hardSolved--;
  }

  // Important Toggle
  if (!oldImportant && progress.important) stats.importantCount++;
  if (oldImportant && !progress.important) stats.importantCount--;

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
  let stats = await DSAStats.findOne({ user: req.user._id });

  if (!stats) {
    stats = await DSAStats.create({ user: req.user._id });
  }

  res.status(200).json({
    success: true,
    stats,
  });
});

export const getFilters = asyncHandler(async (req, res) => {
  const companyDocs = await Problem.distinct("companies");
  const topicDocs = await Problem.distinct("primaryTopic");

  const companies = companyDocs.sort((a, b) => a.localeCompare(b));
  const topics = topicDocs.sort((a, b) => a.localeCompare(b));

  res.status(200).json({
    success: true,
    companies,
    topics,
    difficulties: ["Easy", "Medium", "Hard"],
  });
});
