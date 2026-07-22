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

router.post("/create", authMiddleware, createInterview);

router.post("/answer/:id", authMiddleware, answerInterview);

router.post("/finish/:id", authMiddleware, finishInterview);

router.get("/history", authMiddleware, getInterviewHistory);

router.get("/:id", authMiddleware, getInterviewById);

router.delete("/:id", authMiddleware, deleteInterview);

export default router;
