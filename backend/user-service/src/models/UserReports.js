const mongoose = require('mongoose');

const userReportSchema = new mongoose.Schema({
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // На кого жалуются
  reportingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Кто жалуется
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'ReportTopic', required: true }, // Причина жалобы
  createdAt: { type: Date, default: Date.now }, // Дата жалобы
});

module.exports = mongoose.model('UserReport', userReportSchema);
