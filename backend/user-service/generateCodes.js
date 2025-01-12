const mongoose = require('mongoose');
const Code = require('../user-service/src/models/Code'); // Подключаем модель кодов

mongoose.connect('mongodb://localhost:27017/social_network')
  .then(() => console.log('Подключение к MongoDB успешно'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

const generateCodes = async () => {
  try {
    const codes = [];

    for (let i = 0; i < 6; i++) {
      const code = `CODE_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      codes.push({ code });
    }

    console.log('Сгенерированные коды:', codes); // Для проверки сгенерированных кодов

    const result = await Code.insertMany(codes);
    console.log('Добавленные записи:', result); // Для проверки записанных данных
  } catch (error) {
    console.error('Ошибка при добавлении кодов:', error);
  } finally {
    mongoose.disconnect();
  }
};

generateCodes();
