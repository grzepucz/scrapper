const mongoose = require('mongoose');

const NEWS = 'news';

const newsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    commentsCount: {
        type: Number,
        required: false,
    },
    subscribersCount: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        required: true,
    },
    authors: [
        {
            name: {
                type: String,
                required: false,
            },
            surname: {
                type: String,
                required: false,
            },
            twitter: {
                type: String,
                required: false,
            },
            fb: {
                type: String,
                required: false,
            },
            url: {
                type: String,
                required: false,
            },
        },
    ],
    scrappedAt: {
        type: Date,
        default: new Date(),
        required: true,
    },
});

module.exports = mongoose.model(NEWS, newsSchema);
