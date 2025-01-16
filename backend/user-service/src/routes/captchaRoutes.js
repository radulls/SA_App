const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ваш секретный ключ Google reCAPTCHA
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

router.post('/verify', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    console.log('Токен отсутствует');
    return res.status(400).json({ success: false, message: 'Токен отсутствует' });
  }

  console.log(`Получен токен: ${token}`);

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {},
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    console.log('Ответ Google reCAPTCHA:', response.data);

    if (response.data.success) {
      return res.json({ success: true, message: 'Капча успешно пройдена' });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Ошибка проверки капчи',
        errors: response.data['error-codes'],
      });
    }
  } catch (error) {
    console.error('Ошибка при обращении к Google reCAPTCHA:', error);
    return res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});


module.exports = router;
