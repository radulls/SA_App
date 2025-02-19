const mongoose = require('mongoose');
const SosCancellationReason = require('../models/SosCancellationReason');
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

// 📌 Список причин отмены сигнала SOS
const cancellationReasons = [
  { reason: 'Причина угрозы пропала' },
  { reason: 'Участники объединения оказали помощь' }
];

// 📌 Функция для внесения причин в базу данных
const seedCancellationReasons = async () => {
  try {
    // Очищаем таблицу перед добавлением новых причин (если нужно)
    await SosCancellationReason.deleteMany({});
    console.log('🗑 Таблица `sos_cancellation_reasons` очищена');

    // Добавляем новые причины отмены
    await SosCancellationReason.insertMany(cancellationReasons);
    console.log('✅ Причины отмены успешно добавлены');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Ошибка при внесении причин отмены:', error);
    mongoose.connection.close();
  }
};

// 📌 Запускаем функцию
seedCancellationReasons();
