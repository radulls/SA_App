const express = require('express');
const router = express.Router();
const { blockUser, unblockUser, isBlocked, getBlockedUsers } = require('../controllers/blockedUsersController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/block', verifyToken, blockUser);
router.post('/unblock', verifyToken, unblockUser);
router.get('/blocked-list', verifyToken, getBlockedUsers);
router.get('/isBlocked/:userId', verifyToken, isBlocked);

module.exports = router;
