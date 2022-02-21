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
                        totalHrs: 0,
                        overTime: 0,
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

                //endtime ở emp cũng cần được set.
                req.emp.endDate = nowTime
                req.emp.save();
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
        let totalHours = 0;
        totalHours = req.empCheck.items.slice(-1)[0].hours
        req.empCheck.totalHrs = req.empCheck.totalHrs + totalHours
        if (req.empCheck.totalHrs > 8) {
            overTime = req.empCheck.totalHrs - 8
            req.empCheck.overTime = overTime
        }
        console.log(req.empCheck)
        req.empCheck.save();
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
    const absentSign = 12 - req.emp.annualLeave

    // get all hourLeave in month 
    const hourLeave = (req.emp.listAbsent.map(i => {
        while (i.dayoff.getMonth() + 1 == currentMonth) {
            let hoursnum = 0;
            return hoursnum += i.hourNum
        }
    }))
    const xhourLeave = hourLeave.filter(x => {
        return x != undefined
    })
    const totalhourLeave = xhourLeave.reduce((a, b) => {
        return a + b
    }, 0)
    console.log(totalhourLeave + " hours left")
    // ---------  total hourLeave annual in a month

    // get all overtime have in a month
    const getOvertime = (req.checkinout.map(i => {
        while (i.month == currentMonth) {
            let overwork = 0;
            return overwork += i.overTime
        }
    }));
    const xgetOvertime = getOvertime.filter(x => {
        return x != undefined
    })
    const totalOvertime = xgetOvertime.reduce((a, b) => {
        return a + b
    }, 0);
    console.log(totalOvertime + "total over time");
    // -- total OverTime get by sum of all day 

    //get all hourworking in day
    const getHour = (req.checkinout.map(i => {
        while (i.month == currentMonth) {
            let fullHour = 0;
            return fullHour += i.totalHrs
        }
    }))
    const xgetHour = getHour.filter(x => {
        return x != undefined
    })
    console.log(xgetHour);
    const totalHourWork = xgetHour.reduce((a, b) => {
        return a + b;
    }, 0)
    console.log(totalHourWork + " hour working")
    // --  total hour working in month

    // tạo số giờ tối thiểu cần thiết trong tháng
    const standardHour = (req.checkinout.map(i => {
        while (i.month == currentMonth) {
            let sorthour = 0
            return sorthour = req.checkinout.length * 8
        }
    }))
    const xstandardHour = standardHour.filter(x => {
        return x != undefined
    })
    console.log(xstandardHour[0])
    const standardAMonth = xstandardHour[0]
    //tạo salaryMonth
    const salaryMonth = (req.emp.salaryScale * 3000000) + ((totalOvertime - (standardAMonth - totalHourWork) + totalhourLeave) * 200000)
    console.log(salaryMonth)

    console.log(req.empCheck)
    console.log(req.checkinout.length)

    res.render('mh_3', {
        pageTitle: "Search Employee info",
        path: '/search',
        prods: req.emp,
        prod: req.checkinout,
        pro: req.empCheck,
        absent: absentSign,
        salary: salaryMonth
    });
}
//#endregion

//#region POST SEACH Employee mh_3
exports.searchPost = (req, res, next) => {
    const pickMonth = req.body.pickmonth // get pick month

    // #start tạo thời gian kết thúc
    let filterEmpCheck = req.checkinout.filter(e => {
        return e.month == pickMonth
    })
    resultEmpCheck = []

    for (let i of filterEmpCheck) {
        resultEmpCheck.push(i)
    }
    console.log(resultEmpCheck)

    let getEndday;
    let userEndDay;
    let prodEndDay;
    if (resultEmpCheck == null || resultEmpCheck == "") {
        prodEndDay = null
        resultEmpCheck = null
        console.log(prodEndDay)
    } else {
        getEndday = resultEmpCheck.slice(-1)
        userEndDay = getEndday[0].items.slice(-1)
        prodEndDay = userEndDay[0].endtime
    }

    // #end
    // #start tạo thời gian bắt đầu
    prodCheck = req.checkinout.filter(pr => {
        return pr.month == pickMonth
    })
    resultProdCheck = []
    for (let p of prodCheck) {
        if (prodCheck.length > 0 || prodCheck != null || prodCheck != undefined) {
            resultProdCheck.push(p)
        } else {
            resultProdCheck = null
        }
    }
    console.log(resultProdCheck)
    let getStartDay
    let userStartDay
    let prodStartDay
    if (resultProdCheck == null || resultProdCheck == "") {
        prodStartDay = null
    }
    else {
        getStartDay = resultProdCheck[0]
        userStartDay = getStartDay.items[0]
        prodStartDay = userStartDay.starttime
    }
    //# end

    // get all hourLeave in month 
    const hourLeave = (req.emp.listAbsent.map(i => {
        while (i.dayoff.getMonth() + 1 == pickMonth) {
            if (i.dayoff.getMonth() + 1 == null) {
                hoursnum = 0;
            }
            let hoursnum = 0;
            return hoursnum += i.hourNum
        }
    }))
    const xhourLeave = hourLeave.filter(x => {
        return x != undefined
    })
    const totalhourLeave = xhourLeave.reduce((a, b) => {
        return a + b
    }, 0)
    console.log(totalhourLeave)
    // ---------  total hourLeave annual in a month

    // get all overtime have in a month
    const getOvertime = (req.checkinout.map(i => {
        while (i.month == pickMonth) {
            if (i.month == null) {
                overwork = 0;
            }
            let overwork = 0;
            return overwork += i.overTime
        }
    }));
    const xgetOvertime = getOvertime.filter(x => {
        return x != undefined
    })
    const totalOvertime = xgetOvertime.reduce((a, b) => {
        return a + b
    }, 0);
    console.log(totalOvertime + "this is overTime");
    // -- total OverTime get by sum of all day 

    //get all hourworking in day
    const getHour = (req.checkinout.map(i => {
        while (i.month == pickMonth) {
            if (i.month == null) {
                fullHour = 0;
            }
            let fullHour = 0;
            return fullHour += i.totalHrs
        }
    }))
    const xgetHour = getHour.filter(x => {
        return x != undefined
    })
    const totalHourWork = xgetHour.reduce((a, b) => {
        return a + b;
    }, 0)
    console.log(totalHourWork + "this is totalHourWork in month");
    // --  total hour working in month

    // tạo số giờ tối thiểu cần thiết trong tháng
    const standardHour = (req.checkinout.map(i => {
        while (i.month == pickMonth) {
            if (i.month == null) {
                sorthour = 0;
            }
            let sorthour = 0
            return sorthour = req.checkinout.length * 8
        }
    }))
    let xstandardHou = standardHour.filter(x => {
        return x != undefined
    })
    const standardAMonth = xstandardHou[0]
    console.log(standardAMonth)

    //tạo salaryMonth
    let salaryMonth
    salaryMonth = (req.emp.salaryScale * 3000000) + ((totalOvertime - (standardAMonth - totalHourWork) + totalhourLeave) * 200000)
    if (standardAMonth != NaN || standardAMonth != undefined || standardAMonth != null) {
    } else {
        salaryMonth = "Noooooooooooooooooooooooooooooo"
    }
    console.log(salaryMonth)

    res.render("mh_3Status", {
        pageTitle: "Employee Search info",
        path: "/search",
        prods: req.emp,
        pr: resultEmpCheck,
        salary: salaryMonth,
        prodEnd: prodEndDay,
        prodStart: prodStartDay,
        overTime: totalOvertime
    })
}
// #endregion

//#region POST SEACH Wildcard Search mh_3
exports.postWildCard = (req, res, next) => {
    const hourWork = req.body.wildCard
    console.log(hourWork);
    CheckInOut.find({ totalHrs: hourWork }).then(result => {
        let wildBox = []
        if (result.length != 0 || result.length != "") {
            for (let e of result) {
                wildBox.push(e)
            }
        } else {
            wildBox = null
        }
        console.log(wildBox);
        res.render("mh_3WildCard", {
            pageTitle: "Day working with totalhour work",
            path: "/wildCard",
            prods: wildBox,
            pro: hourWork
        })
    }).catch(err => {
        console.log(err)
    })
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
    const empId = req.emp._id
    const dkThannhietngay = req.body.dk_thannhiet
    const dkThannhietGio = req.body.dk_thannhiet_gio

    const dkVaccine1 = req.body.dk_vaccine1
    const dkVaccineKind1 = req.body.dk_vaccine_kind1

    const dkVaccine2 = req.body.dk_vaccine2
    const dkVaccineKind2 = req.body.dk_vaccine_kind2

    const covidPositive = req.body.covid_historyPositive
    const covidNegative = req.body.covid_historyNegative

    const newInfo = new Covid({
        bodyTemday: dkThannhietngay,
        bodyTemhour: dkThannhietGio,
        vaccineDay1: dkVaccine1,
        vaccineKind1: dkVaccineKind1,
        vaccineDay2: dkVaccine2,
        vaccineKind2: dkVaccineKind2,
        covidInfoEffect: covidPositive,
        covidInfoNega: covidNegative,
        userId: empId
    })
    newInfo.save();
    // req.covi.bodyTemday = dkThannhietngay
    // req.covi.bodyTemhour = dkThannhietGio
    // req.covi.vaccineDay1 = dkVaccine1
    // req.covi.vaccineKind1 = dkVaccineKind1
    // req.covi.vaccineDay2 = dkVaccine2
    // req.covi.vaccineKind2 = dkVaccineKind2
    // req.covi.covidInfoEffect = covidPositive
    // req.covi.covidInfoNega = covidNegative
    // console.log(req.covi);
    // req.covi.save();
    res.render("mh_4Status", {
        pageTitle: "Success",
        path: "/covid",
    });
    console.log("Success!");
}
//#endregion
