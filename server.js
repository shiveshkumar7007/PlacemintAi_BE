import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

import roadmapRoutes from "./routes/roadmapRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

import dsaRoutes from "./routes/dsaRoutes.js";

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// ---------------- Middleware ----------------

app.use(
  cors({
    origin: "https://placemint-ai-fe-seven.vercel.app",
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// ---------------- Routes ----------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message: "PlaceMint AI Backend is running 🚀",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/roadmap", roadmapRoutes);

app.use("/api/interviews", interviewRoutes);

app.use("/api/dsa", dsaRoutes);

// ---------------- Error Handler ----------------

app.use(errorMiddleware);

// ---------------- Server ----------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
