const express = require('express');
const { registerUser, updateUserVerification } = require('../controllers/userController');
const { upload, processUploadedFiles } = require('../middlewares/upload.jsx');

const router = express.Router();

router.post('/register', registerUser);

router.patch(
  '/verify',
  upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'selfiePhoto', maxCount: 1 },
  ]),
  processUploadedFiles, // Обработка загруженных файлов
  updateUserVerification
);

module.exports = router;
