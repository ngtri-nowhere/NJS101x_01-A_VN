const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const checkInOut = new Schema({
    day: Number,
    month: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    items: [
        {
            starttime: { type: Date },
            location: String,
            endtime: { type: Date },
            hours: Number
        }
    ],
    totalHrs: Number,
    overTime: Number,
})

module.exports = mongoose.model("checkIntOut", checkInOut);