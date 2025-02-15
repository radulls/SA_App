const mongoose = require('mongoose');

const sosHelperSchema = new mongoose.Schema({
  sosId: { type: mongoose.Schema.Types.ObjectId, ref: 'SosReport', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SosHelper', sosHelperSchema);
