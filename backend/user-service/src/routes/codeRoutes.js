const express = require('express');
const { createCode, getUsersByInviteCode, getUserCodes } = require('../controllers/codeController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/generate', verifyToken, createCode);
router.get('/invited-users', verifyToken, getUsersByInviteCode);
router.get('/user-codes', verifyToken, getUserCodes); // 🔥 Новый маршрут для получения кодов пользователя

module.exports = router;
