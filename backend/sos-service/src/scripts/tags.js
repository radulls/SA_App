const mongoose = require('mongoose');
const SosTag = require('../models/SosTag');
require('dotenv').config();

// 📌 Подключение к базе данных
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Подключение к MongoDB успешно'))
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err);
    process.exit(1);
  });

// 📌 Список тегов, которые нужно добавить
const tags = [
  { name: 'Авария' },
  { name: 'Нападение' },
  { name: 'Нападение с оружием' },
  { name: 'Ограбление' },
  { name: 'Травма' },
  { name: 'Конфликт' },
  { name: 'Рэкет' },
  { name: 'Мошенничество' }
];

// 📌 Функция для внесения тегов в базу данных
const seedTags = async () => {
  try {
    // Очищаем таблицу перед добавлением новых тегов (если нужно)
    await SosTag.deleteMany({});
    console.log('🗑 Таблица `sos_tags` очищена');

    // Добавляем новые теги
    await SosTag.insertMany(tags);
    console.log('✅ Теги успешно добавлены');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Ошибка при внесении тегов:', error);
    mongoose.connection.close();
  }
};

// 📌 Запускаем функцию
seedTags();
