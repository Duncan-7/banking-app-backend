const jwt = require('jsonwebtoken');

const withAuth = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    console.log("no token")
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        console.log("invalid token")
        console.log(token)
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}

module.exports = withAuth;