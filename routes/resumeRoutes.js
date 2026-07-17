import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  uploadResume,
  analyzeMyResume,
  getResumeHistory,
  getLatestResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

router.get("/analyze/:id", authMiddleware, analyzeMyResume);

router.get("/history", authMiddleware, getResumeHistory);

router.get("/latest", authMiddleware, getLatestResume);

export default router;
