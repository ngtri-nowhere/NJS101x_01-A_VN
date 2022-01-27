const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const covidHistory = new Schema({
    bodyTemday: {
        type: Date
    },
    bodyTemhour: {
        type: String
    },
    vaccineDay1: {
        type: Date,
    },
    vaccineKind1: {
        type: String,
    },
    vaccineDay2: {
        type: Date,
    },
    vaccineKind2: {
        type: String,
    },
    covidInfoEffect: {
        type: Date,
    },
    covidInfoNega: {
        type: Date,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
})

module.exports = mongoose.model("covid", covidHistory);
