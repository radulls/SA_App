const User = require('../models/User');
const City = require('../models/City');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, firstName, lastName, email, phone, cityId, password } = req.body;

    // Проверка, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email уже используется' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username уже используется' });

    // Проверяем существование города
    const city = await City.findById(cityId);
    if (!city) return res.status(400).json({ message: 'Указанный город не существует' });

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      phone,
      city: cityId,
      password,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при регистрации', error: err.message });
  }
};

module.exports = { registerUser };
