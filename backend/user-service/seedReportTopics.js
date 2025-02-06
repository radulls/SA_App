const mongoose = require('mongoose');
const ReportTopic = require('../user-service/src/models/ReportTopics'); // Подключаем модель тем жалоб

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/social_network')
  .then(() => console.log('✅ Подключение к MongoDB успешно'))
  .catch((err) => console.error('❌ Ошибка подключения к MongoDB:', err));

const seedReportTopics = async () => {
  try {
    const topics = [
      { name: 'Спам' },
      { name: 'Мошенничество и обман' },
      { name: 'Насилие' },
      { name: 'Откровенное изображение' },
      { name: 'Ненастоящий аккаунт' },
      { name: 'Враждебные высказывания' },
      { name: 'Опасные организации и символы' },
    ];

    // Проверяем, есть ли уже такие темы в базе
    const existingTopics = await ReportTopic.find();
    if (existingTopics.length > 0) {
      console.log('⚠️ Темы жалоб уже существуют в базе.');
    } else {
      const result = await ReportTopic.insertMany(topics);
      console.log('✅ Темы жалоб успешно добавлены:', result);
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении тем жалоб:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedReportTopics();
