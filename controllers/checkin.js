const Employee = require('../models/employee');


// mh-1
exports.checkIn = (req, res, next) => {
    Employee.find().then(emp => {
        console.log(emp)
        res.render('mh_1', {
            pageTitle: "CheckIn-Out",
            path: "/",
            prods: emp
        });
    }).catch(err => {
        console.log(err);
    })
}

exports.checkinPost = (req, res, next) => {
    const empId = '61dd9cfb6708e6fbefca4c94'

    const location = req.body.location

    // const hourEnd = req.body.hourEnd
    // console.log(hourEnd)
    const hourStart = new Date()
    const getHourStart = hourStart.getUTCHours()
    console.log(getHourStart)

    const hoursOff = req.body.annualLeaveTime
    console.log(hoursOff);
    const reasonOff = req.body.reasonLeaveTime

    Employee.findById(empId).then(emp => {
        emp.location = location
        // emp.hourEnd = hourEnd
        // emp.annualLeave = daysOff
        // emp.reasonLiving = reasonOff
        // emp.annualLeaveHours = hoursOff
        return emp.save()
    }).then(result => {
        console.log('Check-in success')
    }).catch(err => {
        console.log(err)
    })
}

//mh-2
//Get Employee Info
exports.edit = (req, res, next) => {
    Employee.find().then(emp => {
        res.render('mh_2', {
            pageTitle: "Edit Employee",
            path: '/edit',
            prods: emp,
        })
    }).catch(err => {
        console.log(err);
    });
}
// Get editImg mh-2
exports.getEditImg = (req, res, next) => {
    const empId = req.params.employeeId;
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/edit');
    }
    Employee.findById(empId)
        .then(emp => {
            if (!emp) {
                return res.redirect('/edit');
            }
            res.render('mh_5addNew', {
                pageTitle: 'Change Image',
                path: '/addNew',
                editing: editMode,
                employee: emp,
            })
        })
        .catch(err => {
            console.log(err)
        })
}
//mh-2 Post edit employee
exports.postEditEmployee = (req, res, next) => {
    const empId = req.body.employeeId; // gia tri lay ra tu input an 
    const updatedImage = req.body.imageUrl
    Employee.findById(empId)
        .then(emp => {
            emp.imageUrl = updatedImage;
            return emp.save()
        })
        .then(result => {
            console.log("update employ image success");
            res.redirect('/edit');
        })
        .catch(err => {
            console.log(err);
        })
}
//mh-3
exports.search = (req, res, next) => {
    res.render('mh_3', {
        pageTitle: "Search Employee info",
        path: '/search'
    });
}
//mh-4
//Get trang
exports.covid = (req, res, next) => {
    res.render('mh_4', {
        pageTitle: "Covid Vaccine",
        path: '/covid'
    });
}
//Post trang 
exports.covidPost = (req, res, next) => {
    const empId = '61dd9cfb6708e6fbefca4c94'

    const dkThannhiet = req.body.dk_thannhiet
    const dkThannhietGio = req.body.dk_thannhiet_gio


    const dkVaccine = req.body.dk_vaccine
    const dkVaccineKind = req.body.dk_vaccine_kind

    const covidPositive = req.body.covid_historyPositive
    const covidNegative = req.body.covid_historyNegative

    Employee.findById(empId)
        .then(emp => {
            emp.bodyTem = dkThannhiet
            emp.bodyTemHour = dkThannhietGio
            emp.vaccineDate = dkVaccine
            emp.vaccineKind = dkVaccineKind
            emp.covidInfect = covidPositive
            emp.covidNegative = covidNegative
            return emp.save()
        })
        .then(result => {
            console.log("update covid success");
            res.redirect('/');
        }).catch(err => {
            console.log(err);
        });
}
