const mongoose = require('mongoose');

const sosReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Кто создал сигнал
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SosTag' }], // Категории SOS-сигнала
  title: { type: String, required: true },
  description: { type: String, required: true },
  photos: [{ type: String }], // Список URL фотографий
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SosReport', sosReportSchema);
