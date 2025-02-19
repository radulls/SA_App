const mongoose = require('mongoose');

const sosCancellationReasonSchema = new mongoose.Schema({
  reason: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('SosCancellationReason', sosCancellationReasonSchema);
