const mongoose = require('mongoose');

const sosReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SosTag' }], 
  title: { type: String, required: true },
  description: { type: String, required: false },
  photos: [{ type: String }], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'canceled', 'resolved'], 
    default: 'active'
  }, 
  cancellationReason: { type: mongoose.Schema.Types.ObjectId, ref: 'SosCancellationReason', required: false }
});

module.exports = mongoose.model('SosReport', sosReportSchema);
