const Employee = require('../models/employee');
const CheckInOut = require('../models/checkin-out');
const Covid = require('../models/covid');

//Lấy date time values
const currentDay = new Date().getDate();
const currentMonth = new Date().getMonth() + 1;

// #region show path="/"
exports.mh1 = (req, res, next) => {
    Employee.find().then(emp => {
        res.render('mh_1', {
            pageTitle: "CheckIn-Out",
            path: "/",
            prods: emp
        });
    }).catch(err => {
        console.log(err);
    })
}
//#endregion

//#region GET CHECK IN
exports.checkIn = (req, res, next) => {
    Employee.find().then(emp => {
        res.render('mh_1checkIn', {
            pageTitle: "CheckIn",
            path: "/checkIn",
            prods: emp
        });
    }).catch(err => {
        console.log(err);
    })
}
// #endregion

//#region POST CHECK IN wow
exports.checkinPost = (req, res, next) => {
    const empId = req.emp._id;
    const location = req.body.location;
    console.log('POST CHECKIN ' + empId);
    // Chia làm 2 phần 
    // Phần 1 - Nếu user chưa check in vào ngày hôm nay thì tạo mới CheckInOut data
    CheckInOut.findOne(
        {
            userId: empId,
            day: currentDay,
            month: currentMonth
        }
    )
        .then(checkInOutData => {
            // đến đây mình sẽ check xem
            // Nếu user chưa check in
            if (checkInOutData == null || checkInOutData == undefined) {
                //vì item  là 1 mảng nên phải tạo 1 cái array và push vào 
                const newItems = [];
                newItems.push(
                    {
                        starttime: Date.now(),
                        location: location,
                        endtime: '',
                        hour: ''
                    }
                );
                //giờ mình sẽ đi tạo cái CheckInOut data mới 
                const newCheckInOutData = new CheckInOut(
                    {
                        day: currentDay,
                        month: currentMonth,
                        userId: empId,
                        items: newItems,
                        totalHrs: '',
                        overTime: '',
                    }
                );
                return newCheckInOutData.save();
                // vì chưa check out nên ko cần update end time + hrs 
            } else {     // Phần 2 - Nếu user đã  check in vào ngày hôm nay thì update data cũ 
                const addItems = [];
                addItems.push({
                    starttime: Date.now(),
                    location: location
                });
                console.log(addItems[0]);

                checkInOutData.items.push(addItems[0])
                return checkInOutData.save();
            }
        }).then(result => {
            console.log('SUCCESFULLY CHECKED IN ');
            const myresult = result.items.slice(-1);
            console.log(myresult[0].location)
            Employee.find().then(emp => {
                res.render('mh_1checkIn_status', {
                    pageTitle: "CheckIn-Status",
                    path: "/checkInStatus",
                    prods: myresult[0],
                    prod: emp[0]
                })
            })
        }).catch(err => { console.log(err) });
}
// #endregion

// #region GET CHECKOUT
//mh-1 get -checkout
exports.checkOut = (req, res, next) => {
    Employee.find().then(emp => {
        res.render('mh_1checkOut', {
            pageTitle: "CheckOut",
            path: "/checkOut",
            prods: emp
        });
    }).catch(err => {
        console.log(err);
    })
}
//#endregion

//#region POST CHECKOUT
// mh-1 post -checkout 
exports.checkOutPost = (req, res, next) => {
    const empId = req.emp._id;

    CheckInOut.findOne({
        userId: empId,
        day: currentDay,
        month: currentMonth,
    }).then(checkDataItem => {
        if (checkDataItem == null || checkDataItem == undefined) {
            console.log("Should checkin first")
            return res.redirect('/')
        }
        else {
            if (checkDataItem.items.slice(-1)[0].endtime == null || checkDataItem.items.slice(-1)[0].endtime == undefined) {
                const nowTime = new Date()
                const hourNowTime = nowTime.getHours()
                const startTime = checkDataItem.items[0].starttime.getHours()
                // console.log(item)
                const updateCheckOut = [];
                updateCheckOut.push({
                    endtime: nowTime,
                    hours: hourNowTime - startTime
                });
                checkDataItem.items.slice(-1)[0].endtime = updateCheckOut[0].endtime
                checkDataItem.items.slice(-1)[0].hours = updateCheckOut[0].hours
                return checkDataItem.save();
            }
            else {
                res.redirect("checkIn");
                console.log("It's have No wave to checkout-");
            }
        }
    }).then(rejet => {
        // console.log(rejet);

        totalHours = req.empCheck.items.slice(-1)[0].hours
        req.empCheck.totalHrs += totalHours
        if (req.empCheck.totalHrs > 8) {
            overTime = req.empCheck.totalHrs - 8
            req.empCheck.overTime = overTime
        }
        console.log(req.empCheck)
        return req.empCheck.save();
    }).then(result => {
        const nowTime = new Date()
        const prodItem = req.empCheck.items.slice(-1)[0]
        res.render("mh_1checkOutStatus", {
            pageTitle: "Finish CheckOut",
            path: "/checkOut",
            prods: prodItem,
            prod: nowTime
        })
    })
}
//#endregion

//#region GET Absent
exports.absent = (req, res, next) => {
    Employee.find().then(emp => {
        res.render('mh_1absent', {
            pageTitle: "Absent",
            path: '/absent',
            prods: emp
        })
    }).catch(err => {
        console.log(err)
    })
}
//#endregion

//#region POST Absent
exports.absentPost = (req, res, next) => {

    const annualLeaveDay = req.body.annualLeave // chọn ngày muốn nghĩ
    const annualLeaveTime = req.body.annuaLeaveTime // chọn số giờ muốn nghĩ
    const reason = req.body.reasonLeaveTime // lý do nghĩ

    console.log(req.emp.listAbsent);
    let hourday;
    if (annualLeaveTime <= 4) {
        hourday = 0.5;
    } else {
        hourday = 1;
    }

    if (req.emp.annualLeave >= hourday) {
        const newListOff = [];
        newListOff.push({
            dayoff: annualLeaveDay,
            reasionLeave: reason,
            hourNum: annualLeaveTime
        });
        req.emp.listAbsent.push(newListOff[0])
        if (annualLeaveTime <= 4) {
            hourday = 0.5;
            req.emp.annualLeave = req.emp.annualLeave - hourday
        } else {
            hourday = 1;
            req.emp.annualLeave = req.emp.annualLeave - hourday
        }
        req.emp.save();
        console.log("đã save");
        res.render("mh_1absentStatus", {
            pageTitle: "Đăng Ký Success",
            path: "/absent",
            prods: req.emp,
            reasonProd: reason
        });
    }
    else {
        let messageError = "Ngày nghĩ phép không đủ hoặc hết phép"
        res.render("mh_1absentStatus", {
            pageTitle: "Đăng ký Failed",
            path: "/absent",
            prods: req.emp,
            reasonProd: messageError
        })
    }
}
// #endregion

//mh-2
//#region GET Employee
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
//#endregion

//#region GET EDIT EMPLOYEE mh_2
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
//#endregion

//#region POST EDIT Employee mh_2
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
//#endregion


//#region GET SEACH Employee mh_3
exports.search = (req, res, next) => {
    res.render('mh_3', {
        pageTitle: "Search Employee info",
        path: '/search'
    });
}


//#endregion


//#region GET COVID mh_4
exports.covid = (req, res, next) => {
    res.render('mh_4', {
        pageTitle: "Covid Vaccine",
        path: '/covid'
    });
}
//#endregion

//#region POST Covid mh_4
exports.covidPost = (req, res, next) => {
    const empId = '61dd9cfb6708e6fbefca4c94'

    const dkThannhiet = req.body.dk_thannhiet
    const dkThannhietGio = req.body.dk_thannhiet_gio


    const dkVaccine = req.body.dk_vaccine
    const dkVaccineKind = req.body.dk_vaccine_kind

    const covidPositive = req.body.covid_historyPositive
    const covidNegative = req.body.covid_historyNegative

    // Employee.findById(empId)
    //     .then(emp => {
    //         emp.bodyTem = dkThannhiet
    //         emp.bodyTemHour = dkThannhietGio
    //         emp.vaccineDate = dkVaccine
    //         emp.vaccineKind = dkVaccineKind
    //         emp.covidInfect = covidPositive
    //         emp.covidNegative = covidNegative
    //         return emp.save()
    //     })
    //     .then(result => {
    //         console.log("update covid success");
    //         res.redirect('/');
    //     }).catch(err => {
    //         console.log(err);
    //     });
}
//#endregion
