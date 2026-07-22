import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(
  __dirname,
  "../data/PlaceMintAI_Problems_Topics_Added.xlsx",
);

const workbook = xlsx.readFile(excelPath);

const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = xlsx.utils.sheet_to_json(sheet);

const problems = rows.map((row) => ({
  title: row.title?.trim(),

  slug: row.slug?.trim(),

  difficulty: row.difficulty?.trim(),

  primaryTopic: row["Primary Topic"]?.trim(),

  topics: row.Topics ? row.Topics.split(",").map((t) => t.trim()) : [],

  companies: row.companies ? row.companies.split(",").map((c) => c.trim()) : [],

  frequency: String(row.frequency ?? ""),

  problemLink: row.problemLink?.trim(),
}));

const outputPath = path.join(__dirname, "../data/problems.json");

fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2));

console.log("✅ problems.json created successfully.");
console.log("Total Problems :", problems.length);
