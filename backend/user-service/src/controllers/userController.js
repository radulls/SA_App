const User = require('../models/User'); // Подключение модели пользователя
const City = require('../models/City'); // Подключение модели города
const Subscription = require('../models/Subscription');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Для создания токенов
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { log } = require('console');
const Code = require('../models/Code');
const redisClient = require('../redis'); // Обновите путь в зависимости от расположения файла
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Настраиваем локальный SMTP-сервер (например, Mailhog)
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  ignoreTLS: true,
});

const generateUserQRCode = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден.');
    }
    // Создаём данные для QR-кода
    const qrData = JSON.stringify({
      id: user._id,
      username: user.username,
      email: user.email,
    });
    // Путь для сохранения QR-кода (корневой путь проекта)
    const projectRoot = path.resolve(__dirname, '../../'); // Поднимаемся к корню проекта
    const qrDir = path.join(projectRoot, 'uploads/qr-codes');
    const qrPath = path.join(qrDir, `${user._id}.png`);
    // Проверяем, существует ли директория, если нет — создаём
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }
    // Генерация QR-кода с прозрачным фоном и высоким качеством
    await QRCode.toFile(qrPath, qrData, {
      scale: 10, // Увеличиваем плотность пикселей
      margin: 1, // Минимальный отступ
      color: {
        dark: '#000000', // Цвет QR-кода
        light: '#0000'   // Прозрачный фон
      },
    });

    // Сохраняем путь в базе данных
    user.qrCode = `/uploads/qr-codes/${user._id}.png`;
    await user.save();

    return user.qrCode; // Возвращаем путь к QR-коду
  } catch (error) {
    console.error('Ошибка при генерации QR-кода:', error.message);
    throw error; // Генерируем ошибку для обработки выше
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Исключаем поле пароля
    res.status(200).json(users);
  } catch (error) {
    console.error('Ошибка при получении всех пользователей:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

//Subscription
//===================================
const subscribeUser = async (req, res) => {
  try {
    const subscriberId = req.user.id; // ID текущего пользователя
    const { userId: subscribedToId } = req.params; // ID пользователя, на которого подписываемся

    if (!mongoose.Types.ObjectId.isValid(subscribedToId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя.' });
    }

    if (subscriberId.toString() === subscribedToId.toString()) {
      return res.status(400).json({ message: 'Нельзя подписаться на самого себя.' });
    }

    // Проверяем, существует ли подписка
    const existingSubscription = await Subscription.findOne({ subscriber: subscriberId, subscribedTo: subscribedToId });

    if (existingSubscription) {
      return res.status(400).json({ message: 'Вы уже подписаны на этого пользователя.' });
    }

    // Создаем подписку
    await Subscription.create({ subscriber: subscriberId, subscribedTo: subscribedToId });

    // Увеличиваем количество подписчиков у пользователя
    await User.findByIdAndUpdate(subscribedToId, { $inc: { subscribers: 1 } });

    res.status(200).json({ message: 'Вы успешно подписались.' });
  } catch (error) {
    console.error('Ошибка при подписке:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const unsubscribeUser = async (req, res) => {
  try {
    const subscriberId = req.user.id;
    const { userId: subscribedToId } = req.params;

    // Проверяем, существует ли подписка
    const deletedSubscription = await Subscription.findOneAndDelete({
      subscriber: subscriberId,
      subscribedTo: subscribedToId,
    });

    if (!deletedSubscription) {
      return res.status(400).json({ message: 'Вы не были подписаны на этого пользователя.' });
    }

    // Уменьшаем количество подписчиков
    await User.findByIdAndUpdate(subscribedToId, { $inc: { subscribers: -1 } });

    res.status(200).json({ message: 'Вы успешно отписались.' });
  } catch (error) {
    console.error('Ошибка при отписке:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const checkSubscription = async (req, res) => {
  try {
    const subscriberId = req.user.id; // ID текущего пользователя из токена
    const { userId: subscribedToId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subscribedToId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя.' });
    }

    // Проверяем подписку
    const isSubscribed = await Subscription.exists({ subscriber: subscriberId, subscribedTo: subscribedToId });

    res.status(200).json({ isSubscribed: Boolean(isSubscribed) });
  } catch (error) {
    console.error('Ошибка при проверке подписки:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscribers = await Subscription.find({ subscribedTo: userId }).populate('subscriber', 'username profileImage');

    res.status(200).json({ subscribers });
  } catch (error) {
    console.error('Ошибка при получении подписчиков:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.find({ subscriber: userId }).populate('subscribedTo', 'username profileImage');

    res.status(200).json({ subscriptions });
  } catch (error) {
    console.error('Ошибка при получении подписок:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Получен userId на сервере:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя обязателен.' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя.' });
    }

    const user = await User.findById(userId).populate('city', 'name').select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    const profileLink = `http://${req.headers.host}/uploads/qr-codes/${user._id}.png`;

    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        hideLastName: user.hideLastName,
        username: user.username,
        city: user.city?.name || 'Не указан',
        qrCodeLink: profileLink,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Ошибка при получении публичного профиля:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

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

      const newRefreshToken = jwt.sign(
        { id: decoded.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error('Ошибка верификации refreshToken:', error.message);
      return res.status(403).json({ message: 'Недействительный refresh token.' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const registerUser = async (req, res) => {
  try {
    console.log('Получены данные от клиента для регистрации:', req.body);

    const { code } = req.body;

    // Проверяем, существует ли код и не был ли он уже использован
    const validCode = await Code.findOne({ code, isUsed: false });
    if (!validCode) {
      return res.status(400).json({ message: 'Код недействителен или уже использован.' });
    }

    // Проверяем, кто создал код (если у модели `Code` есть `createdBy`)
    const inviter = validCode.createdBy ? await User.findById(validCode.createdBy) : null;

    // Создаём нового пользователя и связываем его с пригласившим
    const newUser = await User.create({
      code,
      invitedBy: inviter ? inviter._id : null, // Привязываем к пригласителю
    });

    console.log('Пользователь успешно создан:', newUser);

    // **Обновляем код как использованный и устанавливаем usedAt**
    validCode.isUsed = true;
    validCode.usedAt = new Date(); // 🟢 Устанавливаем дату использования
    await validCode.save();

    console.log('✅ Код использован:', validCode);

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
      invitedBy: inviter ? inviter._id : null, // Отправляем ID пригласившего
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

    // Проверяем, заблокирован ли пользователь
    const isLocked = await redisClient.get(lockoutKey);
    if (isLocked) {
      return res.status(429).json({ message: 'Слишком много попыток' });
    }

    // Проверяем количество попыток
    let attempts = await redisClient.get(attemptKey);
    attempts = attempts ? parseInt(attempts, 10) : 0;

    if (attempts >= maxAttempts) {
      await redisClient.set(lockoutKey, 'locked', 'PX', lockoutTime);
      await redisClient.del(attemptKey);
      return res.status(429).json({ message: 'Слишком много попыток' });
    }

    // Поиск пользователя
    const user = await User.findOne({
      $or: [
        { email: identifier.trim() },
        { username: identifier.trim() },
        { phone: identifier.trim() },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Аккаунт не существует.' });
    }

    console.log('Хэшированный пароль из базы данных:', user.password);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Если пароль неверный
    if (!isPasswordCorrect || user.isBlocked) {
      await redisClient.incr(attemptKey);
      await redisClient.expire(attemptKey, lockoutTime / 1000);
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ message: 'Email не подтверждён.' });
    }

    // Сбрасываем количество попыток при успешной авторизации
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

const getUserProfile = async (req, res) => {
  try {
    // Получаем ID пользователя из токена
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя обязателен.' });
    }

    // Ищем пользователя в базе данных
    const user = await User.findById(userId).select('-password'); // Исключаем пароль

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Динамический подсчет подписчиков
    const subscribersCount = await Subscription.countDocuments({ subscribedTo: userId });

    // Округляем рейтинг до двух знаков перед отправкой
    const roundedRating = parseFloat((user.rating || 0).toFixed(2));

    res.status(200).json({ 
      message: 'Данные пользователя успешно получены.', 
      user: { 
        ...user.toObject(), 
        subscribers: subscribersCount, // Обновляем количество подписчиков
        rating: roundedRating // Возвращаем округленный рейтинг
      } 
    });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Код действует 15 минут

    user.resetPasswordCode = resetCode;
    user.resetPasswordCodeExpires = expiresAt;
    await user.save();

    await transporter.sendMail({
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Код для смены пароля',
      text: `Ваш код для смены пароля: ${resetCode}. Срок действия 15 минут.`,
    });

    res.status(200).json({ message: `Код для смены пароля отправлен на ваш email ${email}` });
  } catch (error) {
    console.error('Ошибка при отправке кода:', error.message);
    res.status(500).json({ message: 'Ошибка при отправке кода.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      console.log('Отсутствуют обязательные поля:', { email, code, newPassword });
      return res.status(400).json({ message: 'Email, код и новый пароль обязательны.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log('Пользователь не найден для email:', email);
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    console.log('Найден пользователь:', {
      email: user.email,
      password: user.password,
      resetPasswordCode: user.resetPasswordCode,
      resetPasswordCodeExpires: user.resetPasswordCodeExpires,
    });

    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      console.log('Неверный код подтверждения:', { providedCode: code, savedCode: user.resetPasswordCode });
      return res.status(400).json({ message: 'Неверный код подтверждения.' });
    }

    if (new Date() > new Date(user.resetPasswordCodeExpires)) {
      console.log('Код подтверждения истёк:', { codeExpiresAt: user.resetPasswordCodeExpires });
      return res.status(400).json({ message: 'Код подтверждения истёк.' });
    }

    // Устанавливаем сырой пароль — модель сама выполнит хэширование
    user.password = newPassword;
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpires = null;

    const validationError = user.validateSync();
    if (validationError) {
      console.error('Ошибка валидации модели пользователя:', validationError);
      return res.status(400).json({ message: 'Ошибка валидации данных пользователя.' });
    }

    await user.save();
    const updatedUser = await User.findOne({ email });
    console.log('Данные пользователя после сохранения:', {
      email: updatedUser.email,
      password: updatedUser.password,
    });

    console.log('Пароль успешно изменён для пользователя:', email);
    res.status(200).json({ message: 'Пароль успешно изменён.' });
  } catch (error) {
    console.error('Ошибка при смене пароля:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, phone, city, password, firstName, lastName, hideLastName, aboutMe } = req.body;
    const userId = req.user.id;

    // Логика ограничения количества запросов
    const maxAttempts = 5;
    const lockoutTime = 15 * 60 * 1000;
    const attemptKey = `updateAttempts:${userId}`;
    const lockoutKey = `updateLockout:${userId}`;

    const isLocked = await redisClient.get(lockoutKey);
    if (isLocked) {
      return res.status(429).json({ message: 'Слишком много попыток обновления данных. Повторите через 15 минут.' });
    }

    let attempts = await redisClient.get(attemptKey);
    attempts = attempts ? parseInt(attempts, 10) : 0;

    if (attempts >= maxAttempts) {
      await redisClient.set(lockoutKey, 'locked', 'PX', lockoutTime);
      await redisClient.del(attemptKey);
      return res.status(429).json({ message: 'Слишком много попыток. Повторите через 15 минут.' });
    }

    const updates = {};
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Обновляем изображения
    if (req.files) {
      if (req.files.profileImage) {
        if (user.profileImage) {
          const oldProfileImagePath = `.${user.profileImage}`;
          if (fs.existsSync(oldProfileImagePath)) {
            fs.unlinkSync(oldProfileImagePath);
          }
        }
        updates.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
      }

      if (req.files.backgroundImage) {
        if (user.backgroundImage) {
          const oldBackgroundImagePath = `.${user.backgroundImage}`;
          if (fs.existsSync(oldBackgroundImagePath)) {
            fs.unlinkSync(oldBackgroundImagePath);
          }
        }
        updates.backgroundImage = `/uploads/${req.files.backgroundImage[0].filename}`;
      }
    }

    // Обновляем текстовые данные
    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists && usernameExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Имя пользователя уже занято.' });
      }
      updates.username = username;
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email уже используется.' });
      }
      updates.email = email;
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists && phoneExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Телефон уже занят.' });
      }
      updates.phone = phone;
    }

    if (city) {
      const cityExists = await City.findById(city);
      if (!cityExists) {
        return res.status(400).json({ message: 'Указанный город не найден.' });
      }
      updates.city = city;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (aboutMe) updates.aboutMe = aboutMe;
    
    if (typeof hideLastName !== 'undefined') {
      console.log('🔄 Преобразуем hideLastName:', hideLastName, typeof hideLastName);
      updates.hideLastName = hideLastName === 'true' || hideLastName === true;
    }
    console.log('📝 Итоговые обновляемые данные:', updates);    

    // Обновляем пользователя
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Сбрасываем количество попыток при успешном обновлении
    await redisClient.del(attemptKey);

    res.status(200).json({ message: 'Данные обновлены.', user: updatedUser });
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error.message);

    const attemptKey = `updateAttempts:${req.user.id}`;
    const lockoutTime = 15 * 60;
    await redisClient.incr(attemptKey);
    await redisClient.expire(attemptKey, lockoutTime);

    res.status(500).json({ message: 'Ошибка сервера.', error: error.message });
  }
};

const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user?.id; // ✅ Берем ID пользователя из токена

    if (!userId) {
      console.error('❌ Ошибка: Нет ID пользователя в `req.user`');
      return res.status(401).json({ message: 'Ошибка: Нет авторизации. Войдите в аккаунт.' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ Ошибка: Пользователь не найден.');
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // 🔒 Проверяем, не было ли недавнего запроса (антиспам)
    const lastSentTime = user.lastEmailCodeSentAt || 0;
    const now = Date.now();
    const cooldown = 60000; // 60 секунд между запросами

    if (now - lastSentTime < cooldown) {
      console.warn('⏳ Ошибка: Слишком частые запросы. Подождите немного.');
      return res.status(429).json({ message: 'Слишком частые запросы. Попробуйте позже.' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    console.log('🔑 Генерируем код:', verificationCode);

    // НЕ обновляем email сразу! Вместо этого сохраняем в `tempEmail`
    user.tempEmail = email;
    user.emailVerificationCode = verificationCode;
    user.lastEmailCodeSentAt = now; // Запоминаем время отправки
    console.log("💾 Перед сохранением в БД:", {
      tempEmail: user.tempEmail,
      emailVerificationCode: user.emailVerificationCode,
    });
    
    await user.save();

    console.log('✅ Пользователь обновлен с кодом (email не изменен):', {
      tempEmail: user.tempEmail,
      emailVerificationCode: user.emailVerificationCode,
    });

    await transporter.sendMail({
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Код подтверждения',
      text: `Ваш код подтверждения: ${verificationCode}`,
    });

    res.status(200).json({ message: 'Код подтверждения отправлен.' });
  } catch (error) {
    console.error('❌ Ошибка при отправке кода подтверждения:', error.message);
    res.status(500).json({ message: 'Ошибка при отправке кода.' });
  }
};

const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const userId = req.user?.id; // Получаем ID пользователя

    if (!userId) {
      console.error("❌ Ошибка: Нет ID пользователя в `req.user`");
      return res.status(401).json({ message: "Нет авторизации." });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      console.error("❌ Ошибка: Пользователь не найден.");
      return res.status(404).json({ message: "Пользователь не найден." });
    }

    if (user.tempEmail !== email) {
      console.error("❌ Ошибка: Этот email не запрашивался для смены.", {
        storedTempEmail: user.tempEmail,
        requestEmail: email
      });
      return res.status(400).json({ message: "Этот email не запрашивался для смены." });
    }

    if (user.emailVerificationCode !== code) {
      console.error("❌ Ошибка: Неверный код подтверждения.", {
        storedCode: user.emailVerificationCode,
        requestCode: code
      });
      return res.status(400).json({ message: "Неверный код подтверждения." });
    }
    console.log("📌 Email подтверждён, очищаем `tempEmail` и `emailVerificationCode`", {
      email: user.email,
      tempEmail: user.tempEmail,
      emailVerificationCode: user.emailVerificationCode
    });
    
    // ✅ Всё ок, обновляем email
    user.email = user.tempEmail;
    user.tempEmail = null;
    user.emailVerificationCode = null;
    user.emailVerified = true;
    await user.save();

    console.log("✅ Email подтверждён и обновлён:", user.email);
    return res.status(200).json({ message: "Email подтверждён!", email: user.email });
  } catch (error) {
    console.error("❌ Ошибка при проверке кода:", error);
    return res.status(500).json({ message: "Ошибка сервера." });
  }
};

const verifyResetPasswordCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email и код обязательны.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Проверяем код смены пароля
    if (user.resetPasswordCode !== code || new Date() > user.resetPasswordCodeExpires) {
      return res.status(400).json({ message: 'Неверный или истёкший код смены пароля.' });
    }

    res.status(200).json({ message: 'Код успешно подтверждён.' });
  } catch (error) {
    console.error('Ошибка при проверке кода смены пароля:', error.message);
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
    const userId = req.user.id;
    const { firstName, lastName } = req.body;
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

    // Генерация QR-кода
    const qrCode = await generateUserQRCode(userId);

    res.status(200).json({
      message: 'Данные отправлены на верификацию. Регистрация завершена.',
      user: updatedUser,
      qrCode, // Возвращаем ссылку на QR-код
    });
  } catch (error) {
    console.error('Ошибка при обновлении данных для верификации:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const checkVerificationStatus = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Логируем содержимое req.user
    const userId = req.user.id; // Получаем userId из req.user

    if (!userId) {
      console.error('ID пользователя отсутствует в req.user');
      return res.status(400).json({ message: 'ID пользователя обязателен.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('Пользователь не найден для ID:', userId);
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    console.log('Пользователь найден:', user);
    console.log('Отправляем статус верификации:', user.verificationStatus); // Логируем статус
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

const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user?.id || null; // Запрашивающий пользователь (если есть)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя.' });
    }

    const user = await User.findById(userId)
      .populate('city', 'name')
      .select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Подсчет подписчиков
    const subscribersCount = await Subscription.countDocuments({ subscribedTo: userId });

    // Проверка подписки **только если пользователь авторизован**
    let isSubscribed = false;
    if (requesterId && requesterId !== userId) {
      isSubscribed = await Subscription.exists({ subscriber: requesterId, subscribedTo: userId });
    }

    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        hideLastName: user.hideLastName,
        username: user.username,
        city: user.city?.name || 'Не указан',
        profileImage: user.profileImage,
        backgroundImage: user.backgroundImage,
        rating: user.rating,
        aboutMe: user.aboutMe,
        subscribers: subscribersCount,
        isSubscribed: Boolean(isSubscribed), // Будет `false`, если юзер не авторизован
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Ошибка при получении профиля пользователя:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const getUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body; // Получаем массив ID

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'userIds должен быть массивом' });
    }

    // Получаем пользователей по ID
    const users = await User.find({ _id: { $in: userIds } })
      .select('id firstName lastName username profileImage'); // Выбираем только нужные поля

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Ошибка при получении пользователей по ID:', error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.profileImage) {
      return res.status(404).json({ message: 'Фото профиля не найдено.' });
    }

    const imagePath = path.join(__dirname, '../../', user.profileImage); // Путь к файлу
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Удаляем файл с сервера
    }

    user.profileImage = null; // Очищаем поле в базе данных
    await user.save();

    res.status(200).json({ message: 'Фото профиля успешно удалено.' });
  } catch (error) {
    console.error('Ошибка при удалении фото профиля:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const deleteBackgroundImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.backgroundImage) {
      return res.status(404).json({ message: 'Фоновое изображение не найдено.' });
    }

    const imagePath = path.join(__dirname, '../../', user.backgroundImage); // Путь к файлу
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Удаляем файл с сервера
    }

    user.backgroundImage = null; // Очищаем поле в базе данных
    await user.save();

    res.status(200).json({ message: 'Фоновое изображение успешно удалено.' });
  } catch (error) {
    console.error('Ошибка при удалении фонового изображения:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Старый и новый пароль обязательны' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем текущий пароль
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Старый пароль неверный' });
    }

    // ✅ НЕ хешируем пароль вручную, потому что `pre('save')` это сделает!
    user.password = newPassword; // Передаём сырой пароль

    // Логируем перед сохранением
    console.log('⚡ Новый пароль перед сохранением:', newPassword);

    await user.save(); // `pre('save')` в `userSchema` автоматически его захеширует

    // Проверяем, как сохранился пароль
    const updatedUser = await User.findById(req.user.id);
    console.log('🔒 Новый хэшированный пароль в БД:', updatedUser.password);

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = {
  refreshAccessToken,
  generateUserQRCode,
  getAllUsers,
  getPublicProfile,
  registerUser,
  validateActivationCode,
  loginUser,
  getUserProfile,
  sendResetPasswordCode,
  changePassword,
  updateUser,
  sendVerificationCode,
  verifyResetPasswordCode,
  verifyEmailCode,
  checkUsername,
  checkEmail,
  checkPhone,
  updateUserVerification,
  checkVerificationStatus,
  blockUser,
  getUserProfileById,
  subscribeUser, 
  unsubscribeUser, 
  getSubscribers, 
  getSubscriptions,
  checkSubscription,
  getUsersByIds,
  deleteProfileImage,
  deleteBackgroundImage,
  updatePassword
};
