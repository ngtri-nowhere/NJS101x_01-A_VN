
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Employee = require('./models/employee');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const checkinRoutes = require('./routes/checkin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(checkinRoutes);
app.use(errorController.get404);


mongoose.connect('mongodb+srv://user_um10:GSyhQafG8H2KHXom@cluster0.5djo0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000);
    }).catch(err => console.log(err));

console.log("this work");
