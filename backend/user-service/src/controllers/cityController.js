const City = require('../models/City');

// Добавить город
const addCity = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCity = await City.findOne({ name });
    if (existingCity) return res.status(400).json({ message: 'Город уже существует' });

    const city = new City({ name });
    await city.save();

    res.status(201).json({ message: 'Город добавлен', city });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении города', error: err.message });
  }
};

// Получить список всех городов
const getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении списка городов', error: err.message });
  }
};

module.exports = { addCity, getCities };
