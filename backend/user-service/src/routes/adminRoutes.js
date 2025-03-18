const express = require('express');
const { getUserVerificationData } = require('../controllers/adminController');
const { verifyToken, isAdminOrCreator } = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ Получение данных пользователя для верификации (ТОЛЬКО для админа или создателя)
router.get('/users/:id/verification', verifyToken, isAdminOrCreator, getUserVerificationData);

module.exports = router;
