const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
require('dotenv').config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
app.use('/api/sos', require('./src/routes/sosRoutes'));
app.use('/uploads', express.static('uploads'));

// Проверка работы сервера
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Sos Service running on port ${PORT}`));
