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
    annualLeave: {
        type: Number,
    },
    listAbsent: [
        {
            dayoff: Date,
            reasionLeave: String,
            hourNum: Number
        }
    ],
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
    depart: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isAproved: {
        type: Boolean,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    empList: [
        {
            name: String,
            empId: {
                type: Schema.Types.ObjectId,
                ref: 'Employees',
                required: true,
            }
        }
    ],
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