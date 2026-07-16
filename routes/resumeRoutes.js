import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  uploadResume,
  analyzeMyResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

router.get("/analyze/:id", authMiddleware, analyzeMyResume);

export default router;
