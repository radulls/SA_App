const mongoose = require('mongoose');

const reportTopicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Название темы жалобы
});

module.exports = mongoose.model('ReportTopic', reportTopicSchema);
