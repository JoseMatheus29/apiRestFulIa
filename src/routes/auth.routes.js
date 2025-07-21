const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', authMiddleware, userController.getMe);

module.exports = router; 