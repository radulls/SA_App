const mongoose = require('mongoose');

const sosTagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('SosTag', sosTagSchema);
