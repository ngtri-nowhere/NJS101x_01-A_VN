
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Employee = require('./models/employee');
const CheckInOut = require('./models/checkin-out');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const checkinRoutes = require('./routes/checkin');
const { ObjectId } = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//em phải lưu user vào req.user, nó có trong video 
//
app.use((req, res, next) => {
    Employee.findById('61dd9cfb6708e6fbefca4c94')
        .then(emp => {
            req.emp = emp;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;
    CheckInOut.findOne({
        userId: ObjectId('61dd9cfb6708e6fbefca4c94'),
        day: currentDay,
        month: currentMonth
    }).then(empCheck => {
        req.empCheck = empCheck;
        next();
    })
        .catch(err => console.log(err));
})
app.use((req, res, next) => {
    CheckInOut.find().then(checkinout => {
        req.checkinout = checkinout;
        next();
    })
})


app.use(checkinRoutes);
app.use(errorController.get404);

mongoose.connect('mongodb+srv://user_um10:GSyhQafG8H2KHXom@cluster0.5djo0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000);
    }).catch(err => console.log(err));

console.log("this work");
