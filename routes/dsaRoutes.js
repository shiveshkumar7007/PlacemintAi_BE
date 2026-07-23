import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProblems,
  getProblemDetails,
  updateProblemProgress,
  getUserStats,
  getFilters,
} from "../controllers/dsaController.js";

const router = express.Router();

router.get("/problems", authMiddleware, getProblems);

router.get("/problems/:id", authMiddleware, getProblemDetails);

router.put("/progress/:problemId", authMiddleware, updateProblemProgress);

router.get("/stats", authMiddleware, getUserStats);

router.get("/filters", authMiddleware, getFilters);

export default router;
