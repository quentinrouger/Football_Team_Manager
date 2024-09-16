const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Read the token from the cookies
  const token = req.cookies.token;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object
    req.user = decoded;  // e.g., decoded contains the user id
    next();
  } catch (err) {
    // Handle token verification errors
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
