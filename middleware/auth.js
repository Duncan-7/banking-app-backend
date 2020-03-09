const jwt = require('jsonwebtoken');

const withAuth = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}

module.exports = withAuth;