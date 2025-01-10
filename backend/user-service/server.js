const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');

require('dotenv').config();

// Подключение к базе данных
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Роуты
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});
app.use('/api/users', require('./src/routes/userRoutes')); // Роуты пользователей
app.use('/api/cities', require('./src/routes/cityRoutes')); // Роуты городов
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
