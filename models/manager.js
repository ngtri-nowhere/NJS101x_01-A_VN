// info of manager

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const infoManager = new Schema({
    name: {
        type: String,
    },
    doB: {
        type: Date,
    }
})