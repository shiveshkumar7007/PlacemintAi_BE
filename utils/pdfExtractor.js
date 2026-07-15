import fs from "fs";
import pdf from "pdf-parse";

const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const data = await pdf(buffer);

  return data.text;
};

export default extractTextFromPDF;
