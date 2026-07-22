import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Problem from "../models/Problem.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const filePath = path.join(__dirname, "../data/problems.json");

    const problems = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(`📦 Total Problems Found: ${problems.length}`);

    const operations = problems.map((problem) => ({
      updateOne: {
        filter: { slug: problem.slug },
        update: { $setOnInsert: problem },
        upsert: true,
      },
    }));

    const result = await Problem.bulkWrite(operations);

    console.log("\n==============================");
    console.log("🚀 DSA Seeder Completed");
    console.log("==============================");

    console.log("Inserted :", result.upsertedCount);
    console.log("Matched  :", result.matchedCount);
    console.log("Modified :", result.modifiedCount);

    await mongoose.connection.close();

    process.exit(0);
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
};

seedProblems();
