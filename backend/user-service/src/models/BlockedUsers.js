const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema({
  blocker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Кто блокирует
  blocked: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Кого блокируют
  createdAt: { type: Date, default: Date.now } // Дата блокировки
});

// Уникальный индекс, чтобы нельзя было заблокировать одного и того же пользователя дважды
blockedUserSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

module.exports = mongoose.model('BlockedUsers', blockedUserSchema);
