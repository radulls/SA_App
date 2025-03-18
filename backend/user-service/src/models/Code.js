const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  type: { type: String, enum: ['user', 'admin'], required: true },
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date, default: null }, // 🔥 Теперь поле будет существовать, но иметь значение null
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Code', codeSchema);
