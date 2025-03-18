const User = require('../models/User'); 

// Получение данных пользователя для верификации (ТОЛЬКО для админа или создателя)
const getUserVerificationData = async (req, res) => {
  try {
    console.log('ID пользователя:', req.params.id);
    console.log('Авторизованный пользователь:', req.user); 

    const user = await User.findById(req.params.id)
      .populate('city', 'name') // ✅ Загружаем только `name`
      .select('username firstName lastName city role verificationStatus phone email passportPhoto selfiePhoto');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // ✅ Приводим `city` к строке (если есть)
    const formattedUser = {
      ...user.toObject(),
      city: user.city?.name || 'Не указан' // Возвращаем `name` вместо объекта
    };

    console.log('📸 Фото паспорта:', formattedUser.passportPhoto);
    console.log('🤳 Селфи фото:', formattedUser.selfiePhoto);

    res.status(200).json({ user: formattedUser });
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};



module.exports = { getUserVerificationData };
