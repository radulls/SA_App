const User = require('../models/User'); // Подключение модели пользователя
const City = require('../models/City'); // Подключение модели города
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Для создания токенов
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { log } = require('console');
const Code = require('../models/Code');
const redisClient = require('../redis'); // Обновите путь в зависимости от расположения файла

// Настраиваем локальный SMTP-сервер (например, Mailhog)
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  ignoreTLS: true,
});

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token обязателен.' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      const newToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({ token: newToken });
    } catch (error) {
      return res.status(403).json({ message: 'Недействительный refresh token.' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const registerUser = async (req, res) => {
  try {
    console.log('Получены данные от клиента для регистрации:', req.body);

    const { code } = req.body;

    // Проверяем, существует ли уже пользователь с таким кодом
    const existingUser = await User.findOne({ code });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким кодом уже существует.' });
    }

    const newUser = await User.create({ code });
    console.log('Пользователь успешно создан:', newUser);

    // Генерируем токены
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Срок действия accessToken — 1 день
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Срок действия refreshToken — 7 дней
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован.',
      userId: newUser._id,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

const validateActivationCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Код обязателен.' });
    }

    const validCode = await Code.findOne({ code, isUsed: false });

    if (!validCode) {
      return res.status(400).json({ message: 'Неверный активационный код.' });
    }

    res.status(200).json({ message: 'Код действителен.' });
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Необходимо указать логин и пароль.' });
    }

    // Логика проверки лимита попыток
    const maxAttempts = 5;
    const lockoutTime = 15 * 60 * 1000; // 15 минут
    const attemptKey = `loginAttempts:${identifier}`;
    const lockoutKey = `lockout:${identifier}`;

    const isLocked = await redisClient.get(lockoutKey);
    if (isLocked) {
      return res.status(429).json({ message: 'Слишком много попыток' });
    }

    let attempts = await redisClient.get(attemptKey);
    attempts = attempts ? parseInt(attempts, 10) : 0;

    if (attempts >= maxAttempts) {
      await redisClient.set(lockoutKey, 'locked', 'PX', lockoutTime);
      await redisClient.del(attemptKey);
      return res.status(429).json({ message: 'Слишком много попыток' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier },
      ],
    });

    // Если пользователь не найден или пароль неверный
    if (!user || user.isBlocked || !(await bcrypt.compare(password, user.password))) {
      await redisClient.incr(attemptKey);
      await redisClient.expire(attemptKey, lockoutTime / 1000);
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    // Если email не подтверждён
    if (!user.emailVerified) {
      return res.status(400).json({ message: 'Email не подтверждён.' });
    }

    // Успешный вход: сбрасываем попытки
    await redisClient.del(attemptKey);

    // Генерация токенов
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Успешный вход',
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Ошибка при входе:', error.message || error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const sendTemporaryPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен.' });
    }

    // Проверяем, существует ли пользователь с указанным email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь с таким email не найден.' });
    }

    // Генерация временного пароля
    const temporaryPassword = crypto.randomBytes(4).toString('hex'); // 8-значный пароль

    // Хеширование временного пароля перед сохранением
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Обновляем пароль пользователя в базе
    user.password = hashedPassword;
    await user.save();

    // Отправляем временный пароль на почту
    await transporter.sendMail({
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Ваш временный пароль',
      text: `Ваш временный пароль: ${temporaryPassword}. Используйте его для входа и смените его как можно скорее.`,
    });

    res.status(200).json({ message: `Мы отправили ссылку на электронную почту: ${email}, чтобы сбросить пароль.` });
  } catch (error) {
    console.error('Ошибка при отправке временного пароля:', error);
    res.status(500).json({ message: 'Ошибка при отправке временного пароля.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, phone, city, password, firstName, lastName } = req.body;
    const userId = req.user.id; // Получаем ID из токена

    const updates = {};

    // Проверка имени пользователя
    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists && usernameExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Имя пользователя уже занято.' });
      }
      updates.username = username;
    }

    // Проверка email
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email уже занят.' });
      }
      updates.email = email;
    }

    // Проверка телефона
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists && phoneExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Телефон уже занят.' });
      }
      updates.phone = phone;
    }

    // Проверка города
    if (city) {
      const cityExists = await City.findById(city);
      if (!cityExists) {
        return res.status(400).json({ message: 'Указанный город не найден.' });
      }
      updates.city = city;
    }

    // Хеширование и обновление пароля
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    // Обновление имени и фамилии
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;

    // Обновление пользователя
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    res.status(200).json({ message: 'Данные обновлены.', user: updatedUser });
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.', error: error.message });
  }
};

const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      console.error('Email отсутствует.');
      return res.status(400).json({ message: 'Email обязателен.' });
    }

    const userId = req.user.id; // Получаем userId из токена (добавлено verifyToken)
    const user = await User.findById(userId);

    if (!user) {
      console.error('Пользователь не найден для ID:', userId);
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Простой паттерн проверки email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Некорректный email:', email);
      return res.status(400).json({ message: 'Некорректный email.' });
    }

    // Генерация кода подтверждения
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    console.log('Генерируем код:', verificationCode);

    // Обновляем пользователя
    user.email = email; // Сохраняем email
    user.emailVerificationCode = verificationCode; // Сохраняем код подтверждения
    await user.save();

    console.log('Пользователь обновлен с кодом:', {
      email: user.email,
      emailVerificationCode: user.emailVerificationCode,
    });

    // Отправляем email
    await transporter.sendMail({
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Код подтверждения',
      text: `Ваш код подтверждения: ${verificationCode}`,
    });

    res.status(200).json({ message: 'Код подтверждения отправлен.' });
  } catch (error) {
    console.error('Ошибка при отправке кода подтверждения:', error.message);
    res.status(500).json({ message: 'Ошибка при отправке кода.' });
  }
};

const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email и код обязательны.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Если email уже подтвержден
    if (user.emailVerified) {
      console.log('Email уже подтвержден:', email);
      return res.status(200).json({ message: 'Email уже подтвержден.' });
    }

    // Проверяем код
    if (user.emailVerificationCode !== code) {
      console.error('Неверный код подтверждения для пользователя:', user._id);
      return res.status(400).json({ message: 'Неверный код подтверждения.' });
    }

    console.log('Код подтверждения совпал для пользователя:', user._id);

    // Если всё успешно, обновляем данные
    user.emailVerified = true;
    user.emailVerificationCode = null;
    await user.save();

    console.log('Пользователь успешно обновлен:', user);
    res.status(200).json({ message: 'Email подтверждён.' });
  } catch (error) {
    console.error('Ошибка при проверке кода:', error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'ID обязателен.' });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'ID уже используется.' });
    }

    res.status(200).json({ message: 'ID доступен.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен.' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email уже используется.' });
    }

    res.status(200).json({ message: 'Email доступен.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Телефон обязателен.' });
    }

    const user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'Телефон уже используется.' });
    }

    res.status(200).json({ message: 'Телефон доступен.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserVerification = async (req, res) => {
  try {
    const { userId, firstName, lastName } = req.body;
    const { passportPhoto, selfiePhoto } = req.files || {};

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя обязателен.' });
    }

    // Подготовка данных для обновления
    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(passportPhoto?.[0]?.processedPath && { passportPhoto: passportPhoto[0].processedPath }),
      ...(selfiePhoto?.[0]?.processedPath && { selfiePhoto: selfiePhoto[0].processedPath }),
      verificationStatus: 'pending',
    };

    // Проверяем, заполнены ли все основные поля
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (!user.username || !user.email || !user.phone || !user.password) {
      return res.status(400).json({ message: 'Не все обязательные поля заполнены.' });
    }

    // Добавляем изменение статуса завершения регистрации
    updateData.isRegistrationComplete = true;

    // Обновляем данные пользователя
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ message: 'Данные отправлены на верификацию. Регистрация завершена.', user: updatedUser });
  } catch (error) {
    console.error('Ошибка при обновлении данных для верификации:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const checkVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.body; // Получаем userId из тела запроса

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя обязателен.' });
    }

    const user = await User.findById(userId); // Ищем пользователя по ID

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Возвращаем статус верификации
    return res.status(200).json({ verificationStatus: user.verificationStatus });
  } catch (error) {
    console.error('Ошибка при проверке статуса верификации:', error.message);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId, isBlocked } = req.body;

    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({ message: "Поле 'isBlocked' должно быть булевым." });
    }

    const user = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    res.status(200).json({ message: `Пользователь ${isBlocked ? 'заблокирован' : 'разблокирован'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  refreshAccessToken,
  registerUser,
  validateActivationCode,
  loginUser,
  sendTemporaryPassword,
  updateUser,
  sendVerificationCode,
  verifyEmailCode,
  checkUsername,
  checkEmail,
  checkPhone,
  updateUserVerification,
  checkVerificationStatus,
  blockUser,
};
