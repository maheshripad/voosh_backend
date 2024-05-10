const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');


router.get('/', authMiddleware.authenticate, profileController.getProfile);
router.put('/', authMiddleware.authenticate, profileController.updateProfile);
router.post('/photo', authMiddleware.authenticate, profileController.uploadPhoto);
router.put('/visibility', authMiddleware.authenticate, profileController.setProfileVisibility);
router.get('/public', profileController.listPublicProfiles);
router.get('/all', authMiddleware.authorizeAdmin, profileController.listAllProfiles);

module.exports = router;
