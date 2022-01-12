// Info of employee

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const infoEmployee = new Schema({
    name: {
        type: String,
    },
    doB: {
        type: Date,
        required: true
    },
    salaryScale: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
    },
    depart: {
        type: String,
    },
    annualLeave: {
        type: Number,
    },
    imageUrl: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    signOff: {
        type: Number,
        required: false
    },
    hoursInWave: {
        type: Number,
    },
    hoursInDay: {
        type: Number
    },
    hourStart: {
        type: Date,
        default: Date.now
    },
    hourEnd: {
        type: Date,
        default: Date.now
    },
    now: {
        type: Date,
        default: Date.now
    },
    daysWork: {
        type: Number
    },
    salaryMonth: {
        type: Number
    },
    bodyTem: {
        type: Date
    },
    bodyTemHour: {
        type: String
    },
    vaccineDate: {
        type: Date
    },
    vaccineKind: {
        type: String,
    },
    covidInfect: {
        type: Date
    },
    covidNegative: {
        type: Date
    },
    overTime: {
        type: Number
    },
    Offliving: {
        type: Date
    },
    reasonLiving: {
        type: String
    },
    annualLeaveHours: {
        type: Number
    },
}, { timestamps: true });

module.exports = mongoose.model('Employees', infoEmployee);

// ID: employee
// Name: employee
// doB: employee
// Salary Scale: employee
// Start Date: employee
// Department: employee
// Annual Leave: employee
// Image: employee
// Location: employee
// Số ngày nghĩ đăng ký: employee
// Số giờ đã làm trong phiên : employee
// Số giờ đã làm theo ngày: employee
// Ngày: employee
// Salary month: employee 