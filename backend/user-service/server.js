const express = require('express');
const bodyParser = require('body-parser'); // Для обработки тела запроса
const cors = require('cors');
const connectDB = require('./src/config/db');

require('dotenv').config();

// Подключение к базе данных
connectDB();

const app = express();

// Middleware
app.use(cors()); // Разрешение CORS
app.use(bodyParser.json()); // Парсинг JSON
app.use(bodyParser.urlencoded({ extended: true })); // Парсинг URL-кодированных данных

// Подключение маршрутов
app.use('/api/captcha', require('./src/routes/captchaRoutes'));

// Другие маршруты
app.use('/api/users', require('./src/routes/userRoutes')); 
app.use('/api/reports', require('./src/routes/reportRoutes'))
app.use('/api/cities', require('./src/routes/cityRoutes')); 
app.use('/uploads', express.static('uploads'));

// Проверка работы сервера
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
