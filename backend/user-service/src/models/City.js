const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },  // Название города
});

module.exports = mongoose.model('City', citySchema);
