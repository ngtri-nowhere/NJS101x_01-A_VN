const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const covidHistory = new Schema({
    bodyTem: {
        type: Date
    },
    bodyTemhour: {
        type: String
    },
    vaccineDay: {
        type: Date,
    },
    vaccineKind: {
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
