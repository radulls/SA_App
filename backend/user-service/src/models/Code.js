const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true }, // Уникальный код
  isUsed: { type: Boolean, default: false }, // Флаг использования
  createdAt: { type: Date, default: Date.now }, // Дата создания
});

module.exports = mongoose.model('Code', codeSchema);
