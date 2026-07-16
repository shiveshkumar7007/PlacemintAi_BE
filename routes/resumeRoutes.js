import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  uploadResume,
  analyzeMyResume,
  getResumeHistory,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

router.get("/analyze/:id", authMiddleware, analyzeMyResume);

router.get("/history", authMiddleware, getResumeHistory);

export default router;
