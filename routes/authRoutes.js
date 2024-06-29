const { Router } = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Example protected route
router.get('/me', authMiddleware.verifyToken, (req, res) => {
  res.status(200).send({ message: 'User is authenticated' });
});

module.exports = router;
