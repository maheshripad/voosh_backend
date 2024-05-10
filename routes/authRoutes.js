const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login/social', authController.socialLogin);
router.post('/logout', authController.logout);
router.post('/admin', authController.createAdminUser);

router.get('/google', authController.googleAuthRedirect);
router.get('/google/callback', authController.googleAuthCallback);

router.post('/login/google', authController.loginWithGoogle);
router.get('/login/callback/google', authController.loginCallback);

module.exports = router;
