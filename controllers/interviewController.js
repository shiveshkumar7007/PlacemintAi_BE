import Interview from "../models/Interview.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  generateFirstQuestion,
  generateNextQuestion,
  generateInterviewReview,
} from "../services/interviewService.js";

export const createInterview = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    role,
    interviewType,
    difficulty,
    duration,
    language,
    mode,
    description,
  } = req.body;

  if (
    !title ||
    !company ||
    !role ||
    !interviewType ||
    !difficulty ||
    !duration ||
    !mode
  ) {
    const error = new Error("Please fill all required fields");
    error.statusCode = 400;
    throw error;
  }

  const firstQuestion = await generateFirstQuestion({
    company,
    role,
    interviewType,
    difficulty,
    duration,
    language,
    mode,
    description,
  });

  const interview = await Interview.create({
    user: req.user._id,

    title,
    company,
    role,
    interviewType,
    difficulty,
    duration,
    language,
    mode,
    description,

    conversation: [
      {
        speaker: "AI",
        message: firstQuestion,
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: "Interview created successfully",
    interviewId: interview._id,
    question: firstQuestion,
  });
});

//continue interview with answer and generate next question
export const answerInterview = asyncHandler(async (req, res) => {
  const { answer } = req.body;

  if (!answer || answer.trim() === "") {
    const error = new Error("Answer is required");
    error.statusCode = 400;
    throw error;
  }

  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    const error = new Error("Interview not found");
    error.statusCode = 404;
    throw error;
  }

  interview.conversation.push({
    speaker: "USER",
    message: answer,
  });

  const nextQuestion = await generateNextQuestion({
    company: interview.company,
    role: interview.role,
    interviewType: interview.interviewType,
    difficulty: interview.difficulty,
    duration: interview.duration,
    language: interview.language,
    mode: interview.mode,
    description: interview.description,
    conversation: interview.conversation,
  });

  interview.conversation.push({
    speaker: "AI",
    message: nextQuestion,
  });

  interview.currentQuestion += 1;

  await interview.save();

  res.status(200).json({
    success: true,
    question: nextQuestion,
  });
});

export const finishInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    const error = new Error("Interview not found");
    error.statusCode = 404;
    throw error;
  }

  if (interview.status === "Completed") {
    const error = new Error("Interview already completed");
    error.statusCode = 400;
    throw error;
  }

  const review = await generateInterviewReview({
    company: interview.company,
    role: interview.role,
    interviewType: interview.interviewType,
    difficulty: interview.difficulty,
    conversation: interview.conversation,
  });

  interview.review = {
    overallScore: review.overallScore,
    technicalScore: review.technicalScore,
    communicationScore: review.communicationScore,
    confidenceScore: review.confidenceScore,
    strengths: review.strengths || [],
    weaknesses: review.weaknesses || [],
    suggestions: review.suggestions || [],
    hiringDecision: review.hiringDecision || "Not Recommended",
  };

  interview.status = "Completed";
  interview.completedAt = new Date();

  await interview.save();

  res.status(200).json({
    success: true,
    message: "Interview completed successfully.",
    review: interview.review,
  });
});

export const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id,
  })
    .sort({ createdAt: -1 })
    .select(
      "_id title company role status review.overallScore createdAt completedAt",
    );

  const history = interviews.map((item) => ({
    _id: item._id,

    title: item.title,

    company: item.company,

    role: item.role,

    status: item.status,

    overallScore: item.review?.overallScore || 0,

    createdAt: item.createdAt,

    completedAt: item.completedAt,
  }));

  res.status(200).json({
    success: true,
    total: history.length,
    interviews: history,
  });
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    const error = new Error("Interview not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    interview,
  });
});

export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    const error = new Error("Interview not found");
    error.statusCode = 404;
    throw error;
  }

  await Interview.findByIdAndDelete(interview._id);

  res.status(200).json({
    success: true,
    message: "Interview deleted successfully.",
  });
});
