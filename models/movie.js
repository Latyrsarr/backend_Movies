const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  synopsis: { type: String },
  release: { type: Date },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
