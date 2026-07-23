import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createInterview,
  answerInterview,
  finishInterview,
  getInterviewHistory,
  getInterviewById,
  deleteInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

// CHANGED: Removed "/create" so it listens on exactly "/"
router.post("/", authMiddleware, createInterview);

router.post("/answer/:id", authMiddleware, answerInterview);

router.post("/finish/:id", authMiddleware, finishInterview);

// CHANGED: Removed "/history" so it listens on exactly "/"
router.get("/", authMiddleware, getInterviewHistory);

router.get("/:id", authMiddleware, getInterviewById);

router.delete("/:id", authMiddleware, deleteInterview);

export default router;
