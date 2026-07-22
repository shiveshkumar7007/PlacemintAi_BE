import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getProblems,
  getProblemDetails,
  updateProblemProgress,
  getUserStats,
} from "../controllers/dsaController.js";

const router = express.Router();

router.get("/problems", authMiddleware, getProblems);

router.get("/problems/:id", authMiddleware, getProblemDetails);

router.put("/progress/:problemId", authMiddleware, updateProblemProgress);

router.get("/stats", authMiddleware, getUserStats);

export default router;
