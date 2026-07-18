import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRoadmap,
  getActiveRoadmap,
  getRoadmapHistory,
  markDayCompleted,
  completeRoadmap,
  abandonRoadmap,
} from "../controllers/roadmapController.js";

const router = express.Router();

/* Generate AI Roadmap */

router.post("/generate", authMiddleware, createRoadmap);

/* Active Roadmap */

router.get("/active", authMiddleware, getActiveRoadmap);

/* Roadmap History */

router.get("/history", authMiddleware, getRoadmapHistory);

/* Mark One Day Completed */

router.patch("/day/:roadmapId/:day", authMiddleware, markDayCompleted);

/* Complete Goal */

router.patch("/complete/:id", authMiddleware, completeRoadmap);

/* Drop Goal */

router.patch("/drop/:id", authMiddleware, abandonRoadmap);

export default router;
