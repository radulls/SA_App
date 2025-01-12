const express = require('express');
const { 
  refreshAccessToken,
  registerUser, 
  validateActivationCode,
  loginUser, 
  sendTemporaryPassword, 
  sendVerificationCode, 
  verifyEmailCode, 
  updateUser, 
  updateUserVerification, 
  checkUsername,
  checkEmail,
  checkPhone,
  checkVerificationStatus,
  blockUser 
} = require('../controllers/userController');
const { upload, processUploadedFiles } = require('../middlewares/upload.jsx');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/refresh-token', refreshAccessToken);

// Регистрация пользователя
router.post('/register', registerUser);

// Логин пользователя
router.post('/login', loginUser);

// Обновление данных пользователя
router.patch('/update', verifyToken, updateUser);

// Отправка кода подтверждения на email
router.patch('/send-code', verifyToken, sendVerificationCode);
// Маршрут для отправки временного пароля
router.post('/send-temporary-password', sendTemporaryPassword);

router.post('/validate-code', validateActivationCode);
router.post('/check-username', checkUsername);
router.post('/check-email', checkEmail);
router.post('/check-phone', checkPhone);
router.post('/check-verify-status', checkVerificationStatus);

// Подтверждение email с помощью кода
router.post('/verify-code', (req, res, next) => {
  console.log('Пришел запрос на /verify-code:', req.body);
  next();
}, verifyEmailCode);

// Обновление данных верификации
router.patch(
  '/verify',
  verifyToken, // Проверяем токен
  (req, res, next) => {
    upload.fields([
      { name: 'passportPhoto', maxCount: 1 },
      { name: 'selfiePhoto', maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Файл слишком большой.' });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  processUploadedFiles,
  updateUserVerification
);

// Блокировка/разблокировка пользователя
router.patch('/block', verifyToken, blockUser);


module.exports = router;
