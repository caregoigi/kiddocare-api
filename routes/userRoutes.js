const { Router } = require('express');
const userController = require('../controllers/userController');
const authUserJwt = require('../middleware/authUserJwt');
const upload = require('../middleware/upload');

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authUserJwt.verifyUserToken, userController.getUserInfo);
router.put('/update', [authUserJwt.verifyUserToken, upload.single('profileImage')], userController.updateUser);
router.post('/reset-password', authUserJwt.verifyUserToken, userController.resetPassword);

module.exports = router;

