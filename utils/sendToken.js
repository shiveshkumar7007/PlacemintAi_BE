import generateToken from "./generateToken.js";

const sendToken = (user, statusCode, message, res) => {
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Keeps it secure on Render/Vercel (HTTPS)
    sameSite: "none", // Required for cross-site cookies between Vercel and Render
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export default sendToken;
