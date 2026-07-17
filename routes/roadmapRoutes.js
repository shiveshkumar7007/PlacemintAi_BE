import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRoadmap,
  getActiveRoadmap,
  getRoadmapHistory,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/generate", authMiddleware, createRoadmap);

router.get("/active", authMiddleware, getActiveRoadmap);

router.get("/history", authMiddleware, getRoadmapHistory);

export default router;
