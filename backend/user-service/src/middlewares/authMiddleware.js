const jwt = require('jsonwebtoken');

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

module.exports = { verifyToken };
