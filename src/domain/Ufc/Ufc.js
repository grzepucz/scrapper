const mongoose = require('mongoose');

const UFC = 'ufc';

/**
 *
 * @type {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
const ufcSchema = new mongoose.Schema({
    group: {
        type: String,
        required: true,
        index: true,
    },
    rnk: {
        type: String,
        required: true,
        index: true,
    },
    rnd: {
        type: String,
        required: false,
        default: null,
    },
    time: {
        type: String,
        required: false,
        default: null,
    },
    event: {
        type: String,
        required: false,
        default: null,
    },
    percent: {
        type: String,
        required: false,
        default: null,
    },
    fighter: {
        type: String,
        required: false,
        default: null,
    },
    fighters: {
        type: String,
        required: false,
        default: null,
    },
    total: {
        type: String,
        required: false,
        default: null,
    },
    scrappedAt: {
        type: Date,
        default: new Date(),
        required: false,
    },
});

module.exports = mongoose.model(UFC, ufcSchema);
