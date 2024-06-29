const jwt = require('jsonwebtoken');

verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.adminId = decoded.id;
    next();
  });
};

const authAdminJwt = {
  verifyAdminToken,
};

module.exports = authAdminJwt;
