// redis.js
const redis = require('redis');

// Создание клиента Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379', // Используем URL Redis из .env или локальный адрес
});

redisClient.on('connect', () => {
  console.log('Подключено к Redis');
});

redisClient.on('error', (err) => {
  console.error('Ошибка Redis:', err);
});

// Подключение к Redis
(async () => {
  try {
    await redisClient.connect(); // Подключение клиента
    console.log('Redis клиент успешно подключён.');
  } catch (err) {
    console.error('Ошибка подключения к Redis:', err);
  }
})();

module.exports = redisClient;
