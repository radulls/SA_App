const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Кто подписался
  subscribedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // На кого подписан
  createdAt: { type: Date, default: Date.now }
});

// Уникальный индекс, чтобы один пользователь не мог подписаться на другого дважды
subscriptionSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
