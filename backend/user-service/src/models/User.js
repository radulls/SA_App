const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true }, // Уникальный username
  firstName: { type: String, required: false },             // Имя
  lastName: { type: String, required: false },              // Фамилия
  passportPhoto: { type: String, required: false }, // Ссылка на фото паспорта
  selfiePhoto: { type: String, required: false },   // Ссылка на селфи
  email: { type: String, unique: true, required: true },   // Почта
  phone: { type: String, required: true },                 // Телефон
  city: { type: String, required: true },                  // Город (теперь строка)
  role: { type: String, enum: ['user', 'admin', 'creator'], default: 'user' }, // Роль
  rating: { type: Number, default: 0 },                    // Рейтинг
  subscriptionActive: { type: Boolean, default: false },   // Активна ли подписка
  subscriptionStart: { type: Date },                       // Начало подписки
  subscriptionEnd: { type: Date },                         // Конец подписки
  password: { type: String, required: true },              // Пароль
  createdAt: { type: Date, default: Date.now },            // Дата создания
});

// Хэширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
