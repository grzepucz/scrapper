const mongoose = require('mongoose');

const ARTICLE = 'article';

const articleSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    commentsCount: {
        type: Number,
        required: false,
    },
    url: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        required: true,
    },
    scrappedAt: {
        type: Date,
        default: new Date(),
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    categoryUrl: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model(ARTICLE, articleSchema);
