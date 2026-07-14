import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

//Middlewares

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// routes

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PlaceMint AI Backend is running 🚀",
  });
});

// Start the server

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});