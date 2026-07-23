const sendToken = (user, statusCode, message, res) => {
  // Create JWT token (assuming your User model has a method for this, or use jsonwebtoken directly)
  const token = user.getJWTToken ? user.getJWTToken() : user.generateToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true, // Required for HTTPS in production (Vercel & Render)
    sameSite: "none", // Required because frontend and backend are on different domains
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    token,
    user,
  });
};

export default sendToken;
