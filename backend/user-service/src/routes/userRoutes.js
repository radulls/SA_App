const express = require('express');
const { 
  refreshAccessToken,
  generateUserQRCode,
  getPublicProfile,
  registerUser, 
  validateActivationCode,
  loginUser, 
  sendResetPasswordCode,
  changePassword, 
  sendVerificationCode, 
  verifyResetPasswordCode,
  verifyEmailCode, 
  updateUser, 
  updateUserVerification, 
  checkUsername,
  checkEmail,
  checkPhone,
  checkVerificationStatus,
  blockUser,
  getUserProfileById,
  subscribeUser, 
  unsubscribeUser, 
  getSubscribers, 
  getSubscriptions,
  checkSubscription  
} = require('../controllers/userController');
const { upload, processUploadedFiles } = require('../middlewares/upload.jsx');
const { verifyToken } = require('../middlewares/authMiddleware');
const User = require('../models/User'); // Замените путь на корректный

const router = express.Router();

// Маршрут для обновления токена
router.post('/refresh-token', refreshAccessToken);

router.post('/generate-qr-code', verifyToken, generateUserQRCode);

router.get('/public-qr-code/:userId', getPublicProfile);

// Регистрация пользователя
router.post('/register', registerUser);

// Логин пользователя
router.post('/login', loginUser);

// Получение данных текущего пользователя
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Найдите пользователя и популяруйте данные о городе
    const user = await User.findById(req.user.id).populate('city', 'name'); // 'name' - поле в коллекции City
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    res.status(200).json({ message: 'Данные пользователя успешно получены.', user });
  } catch (error) {
    console.error('Ошибка на сервере:', error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

// Обновление данных пользователя и загрузка фото профиля
router.patch(
  '/update',
  verifyToken,
  (req, res, next) => {
    upload.fields([
      { name: 'profileImage', maxCount: 1 },
      { name: 'backgroundImage', maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Файл слишком большой.' });
        }
        return res.status(400).json({ message: err.message });
      }
      console.log('Файлы загружены:', req.files); // Логируем загруженные файлы
      next();
    });
  },
  processUploadedFiles, // Обработка изображений (уменьшение размера)
  updateUser // Обновление данных пользователя
);

// Отправка кода подтверждения на email
router.patch('/send-code', verifyToken, sendVerificationCode);

// Маршрут для смены пароля
router.post('/send-reset-password-code', sendResetPasswordCode);
router.post('/verify-reset-password-code', verifyResetPasswordCode);
router.post('/change-password', changePassword);

// Валидация активационного кода
router.post('/validate-code', validateActivationCode);

// Проверка доступности username, email, phone
router.post('/check-username', checkUsername);
router.post('/check-email', checkEmail);
router.post('/check-phone', checkPhone);

// Проверка статуса верификации
router.post('/check-verify-status', verifyToken, checkVerificationStatus);

// Подтверждение email с помощью кода
router.post('/verify-code', (req, res, next) => {
  console.log('Пришел запрос на /verify-code:', req.body);
  next();
}, verifyEmailCode);

// Обновление данных для верификации
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

// Получение данных пользователя по id
router.get('/profile/:userId', getUserProfileById);

// Подписаться на пользователя
router.post('/subscribe/:userId', verifyToken, subscribeUser);

// Отписаться от пользователя
router.post('/unsubscribe/:userId', verifyToken, unsubscribeUser);

// Получить список подписчиков пользователя
router.get('/subscribers/:userId', getSubscribers);

// Получить список пользователей, на которых подписан текущий пользователь
router.get('/subscriptions/:userId', getSubscriptions);

router.get('/is-subscribed/:userId', verifyToken, checkSubscription);


module.exports = router;