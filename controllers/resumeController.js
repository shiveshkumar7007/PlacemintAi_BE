import { PDFParse } from "pdf-parse";

import Resume from "../models/Resume.js";

import asyncHandler from "../utils/asyncHandler.js";

import { encryptData, decryptData } from "../utils/encryption.js";

import analyzeResume from "../services/aiService.js";

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Please upload a PDF");

    error.statusCode = 400;

    throw error;
  }

  const parser = new PDFParse({
    data: req.file.buffer,
  });

  const pdfData = await parser.getText();

  const extractedText = pdfData.text;

  await parser.destroy();

  const encrypted = encryptData(extractedText);

  const resume = await Resume.create({
    user: req.user._id,

    fileName: req.file.originalname,

    encryptedText: encrypted.encryptedData,

    iv: encrypted.iv,
  });

  res.status(201).json({
    success: true,

    message: "Resume uploaded successfully",

    resumeId: resume._id,
  });
});

export const analyzeMyResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,

    user: req.user._id,
  });

  if (!resume) {
    const error = new Error("Resume not found");

    error.statusCode = 404;

    throw error;
  }

  // decrypt text

  const resumeText = decryptData(
    resume.encryptedText,

    resume.iv,
  );

  // send to AI

  const analysis = await analyzeResume(resumeText);

  // save AI result

  resume.analysis = analysis;

  await resume.save();

  res.status(200).json({
    success: true,

    message: "Resume analyzed successfully",

    analysis,
  });
});
