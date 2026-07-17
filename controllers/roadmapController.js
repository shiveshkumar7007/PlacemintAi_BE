import asyncHandler from "../utils/asyncHandler.js";

import Roadmap from "../models/Roadmap.js";

import generateRoadmap from "../services/roadmapService.js";

export const createRoadmap = asyncHandler(async (req, res) => {
  const { company, role, targetDays, skillLevel, dailyStudyHours } = req.body;

  if (!company || !role || !targetDays || !skillLevel || !dailyStudyHours) {
    const error = new Error("All fields are required.");
    error.statusCode = 400;
    throw error;
  }

  // Only one active roadmap per user
  const activeRoadmap = await Roadmap.findOne({
    user: req.user._id,
    status: "ACTIVE",
  });

  if (activeRoadmap) {
    const error = new Error(
      "You already have an active roadmap. Complete or drop it before creating a new one.",
    );

    error.statusCode = 409;

    throw error;
  }

  const roadmap = await generateRoadmap({
    company,
    role,
    targetDays: Number(targetDays),
    skillLevel,
    dailyStudyHours: Number(dailyStudyHours),
  });

  const newRoadmap = await Roadmap.create({
    user: req.user._id,

    company,

    role,

    targetDays,

    skillLevel,

    dailyStudyHours,

    roadmap,
  });

  res.status(201).json({
    success: true,

    message: "Roadmap generated successfully.",

    roadmap: newRoadmap,
  });
});

export const getActiveRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({
    user: req.user._id,
    status: "ACTIVE",
  });

  if (!roadmap) {
    return res.status(404).json({
      success: false,
      message: "No active roadmap found.",
    });
  }

  res.status(200).json({
    success: true,
    roadmap,
  });
});

export const getRoadmapHistory = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    roadmaps,
  });
});
