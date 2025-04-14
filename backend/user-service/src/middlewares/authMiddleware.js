const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Подключаем модель пользователя

// Проверка токена
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Извлекаем токен из заголовка Authorization

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует. Авторизация отклонена.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Проверяем токен
    req.user = decoded; // Сохраняем данные пользователя из токена в объекте запроса
    next(); // Продолжаем выполнение запроса
  } catch (error) {
    console.error('Ошибка верификации токена:', error.message);
    res.status(403).json({ message: 'Недействительный токен. Доступ запрещён.' });
  }
};

// Проверка на администратора
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещён. Пользователь не найден.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён. Требуются права администратора.' });
    }

    next(); // Продолжаем выполнение запроса
  } catch (error) {
    console.error('Ошибка при проверке роли администратора:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

const isAdminOrCreator = async (req, res, next) => {
  try {
    console.log('Проверка пользователя:', req.user); // Логируем данные из токена
    
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещён. Пользователь не найден.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    console.log('Роль пользователя:', user.role); // Логируем роль

    if (user.role !== 'admin' && user.role !== 'creator') {
      return res.status(403).json({ message: 'Доступ запрещён. Требуются права администратора или создателя.' });
    }

    next(); // Если всё ок — продолжаем выполнение запроса
  } catch (error) {
    console.error('Ошибка при проверке роли:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};


module.exports = { verifyToken, isAdmin, isAdminOrCreator };
