
const path = require('path');


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Employee = require('./models/employee');
const CheckInOut = require('./models/checkin-out');
const Covid = require('./models/covid');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const empUser = require('./models/employee');

const MONGODB_URI = "mongodb+srv://user_um333:PtVKLHIqdgD5YBAQ@asm2.usv6n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

// filter cho multer
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().getTime() + '-' + file.originalname);
//     }
// });
// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg'
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

app.set('view engine', 'ejs');
app.set('views', 'views');

const checkinRoutes = require('./routes/checkin');
const authRoutes = require('./routes/auth');
const { ObjectId } = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }));

// Sử dụng multer để tạo file và lưu file
// app.use(multer({
//     storage: fileStorage, fileFilter: fileFilter
// })).single('imageUrl')

// app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

// #region Employee module => emp
app.use((req, res, next) => {
    Employee.findById('61f3d32cf3a6b01253fb9105')
        .then(emp => {
            req.emp = emp;
            next();
        })
        .catch(err => console.log(err));
});
// #endregion

// #region CheckinOut module currentTime => empCheck
app.use((req, res, next) => {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;
    CheckInOut.findOne({
        userId: ObjectId('61f3d32cf3a6b01253fb9105'),
        day: currentDay,
        month: currentMonth
    }).then(empCheck => {
        req.empCheck = empCheck;
        next();
    })
        .catch(err => console.log(err));
})
//  #endregion

//#region CheckInOut module all stuff => checkinout
app.use((req, res, next) => {
    CheckInOut.find().then(checkinout => {
        req.checkinout = checkinout;
        next();
    })
})
//#endregion

// #region Covid module all stuff => covi
app.use((req, res, next) => {
    Covid.find().then(covi => {
        req.covi = covi;
        next();
    })
})
//#endregion

app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    console.log(res.locals.isAuthenticated)
    next();
});
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    Employee.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user
            next();
        }).catch(err => {
            next(new Error(err));
        })
})

app.use(checkinRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//     res.status(500).render('500', {
//         pageTitle: 'Error!',
//         path: '/500',
//         isAuthenticated: req.session.isLoggedIn
//     })
// })

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    }).catch(err => console.log(err));

console.log("this work");
