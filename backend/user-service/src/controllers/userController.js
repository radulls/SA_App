const User = require('../models/User'); // Подключение модели пользователя

const registerUser = async (req, res) => {
  try {
    const { code, username, email, password, phone, city } = req.body;

    // Проверка обязательных полей
    if (!code || !username || !email || !password || !phone || !city) {
      return res.status(400).json({ message: "Все обязательные поля должны быть заполнены" });
    }

    // Логика создания пользователя
    const newUser = await User.create({
      code,
      username,
      email,
      password,
      phone,
      city,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserVerification = async (req, res) => {
  try {
    const { userId, firstName, lastName } = req.body;
    const { passportPhoto, selfiePhoto } = req.files || {};

    if (!userId) {
      return res.status(400).json({ message: "ID пользователя обязателен" });
    }

    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(passportPhoto?.[0]?.processedPath && { passportPhoto: passportPhoto[0].processedPath }),
      ...(selfiePhoto?.[0]?.processedPath && { selfiePhoto: selfiePhoto[0].processedPath }),
    };

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ message: "Верификация успешно обновлена", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { registerUser, updateUserVerification };
