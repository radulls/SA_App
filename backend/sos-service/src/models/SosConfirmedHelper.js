const mongoose = require('mongoose');

const sosConfirmedHelperSchema = new mongoose.Schema({
  sosId: { type: mongoose.Schema.Types.ObjectId, ref: 'SosReport', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Владелец сигнала
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SosConfirmedHelper', sosConfirmedHelperSchema);
