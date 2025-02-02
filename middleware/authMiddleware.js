const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.User;

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
