import { PDFParse } from "pdf-parse";

import Resume from "../models/Resume.js";

import asyncHandler from "../utils/asyncHandler.js";

import { encryptData, decryptData } from "../utils/encryption.js";

import analyzeResume from "../services/aiService.js";

// Upload Resume

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

  // keep only latest 5 resumes

  const resumeCount = await Resume.countDocuments({
    user: req.user._id,
  });

  if (resumeCount >= 5) {
    const oldestResume = await Resume.findOne({
      user: req.user._id,
    }).sort({
      createdAt: 1,
    });

    if (oldestResume) {
      await Resume.findByIdAndDelete(oldestResume._id);
    }
  }

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

    uploadedAt: resume.createdAt,
  });
});

// Analyze Resume

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

  const resumeText = decryptData(
    resume.encryptedText,

    resume.iv,
  );

  const analysis = await analyzeResume(resumeText);

  resume.analysis = analysis;

  await resume.save();

  res.status(200).json({
    success: true,

    message: "Resume analyzed successfully",

    analysis,
  });
});

// Resume History

export const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({
    user: req.user._id,
  })

    .select("fileName analysis.score createdAt")

    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,

    resumes,
  });
});

export const getLatestResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
      user: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .select("fileName analysis createdAt");

    if (!resume) {
      return res.status(200).json({
        success: true,
        resume: null,
      });
    }

    res.status(200).json({
      success: true,

      resume,
    });
  });
