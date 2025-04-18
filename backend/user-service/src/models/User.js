const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true }, // Обязательный код на первом шаге
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  username: { type: String, unique: true, default: null }, // Делаем обязательным, но генерируем временные уникальные значения
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  hideLastName: { type: Boolean, required: false, default: false },
  aboutMe: { type: String, required: false },
  passportPhoto: { type: String, required: false },
  selfiePhoto: { type: String, required: false },
  profileImage: { type: String, required: false },
  backgroundImage: { type: String, required: false },
  qrCode: { type: String, required: false },
  email: { type: String, unique: true, default: null }, // Аналогично
  tempEmail: { type: String, required: false }, // Временный email для подтверждения
  phone: { type: String, unique: true, default: null },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: false },
  role: { type: String, enum: ['user', 'admin', 'creator'], default: 'user' },
  rating: { 
    type: Number, 
    default: 0, 
    min: 0,
    set: (val) => parseFloat(val.toFixed(2)), // Округляем до 2 знаков после запятой
  }, 
  subscribers: { type: Number, default: 0, min: 0 }, // Количество подписчиков, минимальное значение 0
  subscriptionActive: { type: Boolean, default: false },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  verificationStatus: {
    type: String,
    enum: ['not_verified', 'pending', 'verified', 'paymant', 'rejected', 'blocked'],
    default: 'not_verified',
  },
  emailVerificationCode: { type: String },
  emailVerified: { type: Boolean, default: false },
  resetPasswordCode: { type: String, required: false }, // Новый код для смены пароля
  resetPasswordCodeExpires: { type: Date, required: false },
  rejectionReason: { type: String, required: false },
  isBlocked: { type: Boolean, default: false },
  isRegistrationComplete: { type: Boolean, default: false },
  mfa: {
    secret: { type: String },
    enabled: { type: Boolean, default: false },
  },
});

// Хэширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Генерация временных уникальных значений
userSchema.pre('validate', function (next) {
  if (!this.username) this.username = `user_${new mongoose.Types.ObjectId()}`;
  if (!this.email) this.email = `placeholder_email_${new mongoose.Types.ObjectId()}`;
  if (!this.phone) this.phone = `placeholder_phone_${new mongoose.Types.ObjectId()}`;
  next();
});

module.exports = mongoose.model('User', userSchema);