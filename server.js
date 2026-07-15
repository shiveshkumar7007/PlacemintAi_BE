import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// ---------------- Middleware ----------------

app.use(
  cors({
    origin: "http://localhost:5173",
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

// ---------------- Error Handler ----------------

app.use(errorMiddleware);

// ---------------- Server ----------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
