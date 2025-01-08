const express = require('express');
const { addCity, getCities } = require('../controllers/cityController');

const router = express.Router();

router.post('/add', addCity);  // Добавить новый город
router.get('/', getCities);    // Получить список всех городов

module.exports = router;
