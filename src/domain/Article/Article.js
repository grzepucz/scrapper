const mongoose = require('mongoose');

const ARTICLE = 'article';

const articleSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model(ARTICLE, articleSchema);
