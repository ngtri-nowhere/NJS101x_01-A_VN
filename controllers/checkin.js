const Employee = require('../middleware/models/employee');
const CheckInOut = require('../middleware/models/checkin-out');
const Covid = require('../middleware/models/covid');

const Paginate = require('../util/paginate');
const fileHelper = require('../util/file')

const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 2;

//Lấy date time values
const currentDay = new Date().getDate();
const currentMonth = new Date().getMonth() + 1;

// #region show path="/"
exports.mh1 = (req, res, next) => {
    Employee.find().then(emp => {
        res.render('mh_1', {
            pageTitle: "CheckIn-Out",
            path: "/",
            prods: emp,
        });
    }).catch(err => {
        console.log(err);
    })
}
//#endregion

//#region GET CHECK IN
exports.checkIn = (req, res, next) => {
    const empId = req.session.user._id
    Employee.findById(empId).then(emp => {
        res.render('mh_1checkIn', {
            pageTitle: "CheckIn",
            path: "/checkIn",
            prods: emp,
        });
    }).catch(err => {
        console.log(err);
    })
}
// #endregion

//#region POST CHECK IN wow
exports.checkinPost = (req, res, next) => {
    const empId = req.session.user._id;
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
            Employee.findById(empId).then(emp => {
                res.render('mh_1checkIn_status', {
                    pageTitle: "CheckIn-Status",
                    path: "/checkInStatus",
                    prods: myresult[0],
                    prod: emp
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
            prods: emp,
        });
    }).catch(err => {
        console.log(err);
    })
}
//#endregion

//#region POST CHECKOUT
// mh-1 post -checkout 
exports.checkOutPost = (req, res, next) => {
    const empId = req.session.user._id;

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
                Employee.findById(empId).then(myemp => {
                    myemp.endDate = nowTime
                    myemp.save()
                })
                checkDataItem.items.slice(-1)[0].endtime = updateCheckOut[0].endtime
                checkDataItem.items.slice(-1)[0].hours = updateCheckOut[0].hours
                // tạo totalHours để add totalHours và tạo ra overTime từ đó
                let totalHours
                totalHours = checkDataItem.items.slice(-1)[0].hours
                checkDataItem.totalHrs += totalHours
                if (checkDataItem.totalHrs > 8) {
                    overTime = checkDataItem.totalHrs - 8
                    checkDataItem.overTime = overTime
                }
                return checkDataItem.save();
            }
            else {
                res.redirect("checkIn");
                console.log("It's have No wave to checkout-");
            }
        }
    }).then(result => {
        console.log(result)
        const nowTime = new Date()
        const prodItem = result.items.slice(-1)[0]
        res.render("mh_1checkOutStatus", {
            pageTitle: "Finish CheckOut",
            path: "/checkOut",
            prods: prodItem,
            prod: nowTime
        })
    }).catch(err => {
        console.log(err)
    })
}
//#endregion

//#region GET Absent
exports.absent = (req, res, next) => {
    Employee.find().then(emp => {
        res.render('mh_1absent', {
            pageTitle: "Absent",
            path: '/absent',
            prods: emp,
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

    const empId = req.session.user._id

    let hourday;
    if (annualLeaveTime <= 4) {
        hourday = 0.5;
    } else {
        hourday = 1;
    }
    Employee.findById(empId).then(myEmp => {
        if (myEmp.annualLeave >= hourday) {
            const newListOff = [];
            newListOff.push({
                dayoff: annualLeaveDay,
                reasionLeave: reason,
                hourNum: annualLeaveTime
            });
            myEmp.listAbsent.push(newListOff[0])
            if (annualLeaveTime <= 4) {
                hourday = 0.5;
                myEmp.annualLeave = myEmp.annualLeave - hourday
            } else {
                hourday = 1;
                myEmp.annualLeave = myEmp.annualLeave - hourday
            }
            myEmp.save();
            console.log("đã save");
            res.render("mh_1absentStatus", {
                pageTitle: "Đăng Ký Success",
                path: "/absent",
                prods: myEmp,
                reasonProd: reason
            });
        }
        else {
            let messageError = "Ngày nghĩ phép không đủ hoặc hết phép"
            res.render("mh_1absentStatus", {
                pageTitle: "Đăng ký Failed",
                path: "/absent",
                prods: myEmp,
                reasonProd: messageError
            })
        }
    })
}
// #endregion

//mh-2
//#region GET Employee
//Get Employee Info
exports.edit = (req, res, next) => {
    const empId = req.session.user._id
    Employee.findById(empId).then(emp => {

        const newProds = emp.imageUrl
        console.log(newProds)
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
            res.render('mh_2addNew', {
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
    const image = req.file;
    console.log(image);

    Employee.findById(empId).then(emp => {
        if (image) {
            fileHelper.deleteFile(emp.imageUrl);
            emp.imageUrl = image.path
        }
        return emp.save().then(result => {
            console.log("Update Employee Success!");
            res.redirect('/edit')
        });
    }).catch(err => {
        console.log(err)
    })

}
//#endregion

//#region GET SEACH Employee mh_3
exports.search = (req, res, next) => {
    const empId = req.session.user._id

    Employee.findById(empId).then(emp => {
        const absentSign = 12 - emp.annualLeave
        // get all hourLeave in month 
        const hourLeave = (emp.listAbsent.map(i => {
            while (i.dayoff.getMonth() + 1 == currentMonth) {
                let hoursnum = 0;
                return hoursnum += i.hourNum
            }
        }))
        console.log(hourLeave)
        const xHourLeave = hourLeave.filter(x => {
            return x !== undefined
        })
        console.log(xHourLeave)
        const totalhourLeave = xHourLeave.reduce((a, b) =>
            a + b
            , 0)
        console.log("totalhourLeave " + totalhourLeave)
        // ---------  total hourLeave annual in a month

        // get all overtime have in a month
        const getOvertime = req.checkinout.map(check => {
            while (check.userId.toString() == emp._id.toString() && check.month == currentMonth) {
                let numberOverTime = 0;
                return numberOverTime += check.overTime
            }
        })
        // loại bỏ những  undefined khi chạy điều kiện qua map
        const xOverTime = getOvertime.filter(x => {
            return x !== undefined
        })
        console.log(xOverTime)
        const totalOvertime = xOverTime.reduce((a, b) => {
            return a + b
        }, 0)
        console.log("Total OverTime " + totalOvertime)
        // -- total OverTime get by sum of all day 

        //get all hourworking in day
        const getHour = (req.checkinout.map(i => {
            while (i.userId.toString() == emp._id.toString() && i.month == currentMonth) {
                let fullHour = 0;
                return fullHour += i.totalHrs
            }
        }))
        // loại bỏ những  undefined khi chạy điều kiện qua map
        const xGetHour = getHour.filter(x => {
            return x !== undefined
        })
        console.log(xGetHour);
        const totalHourWork = xGetHour.reduce((a, b) => {
            return a + b;
        }, 0)
        console.log("Total hour work" + totalHourWork)
        // --  total hour working in month

        // tạo số giờ tối thiểu cần thiết trong tháng
        const standardHour = (req.checkinout.map(i => {
            while (i.userId.toString() == emp._id.toString() && i.month == currentMonth) {
                return i.day
            }
        }))
        const xStandardHour = standardHour.filter(x => {
            return x !== undefined
        })
        console.log(xStandardHour.length)
        const standardAMonth = xStandardHour.length * 8
        console.log(standardAMonth + " gio lam can thiet cua mot thang")
        //tạo salaryMonth

        const salaryMonth = (emp.salaryScale * 3000000) + ((totalOvertime - (standardAMonth - totalHourWork) + totalhourLeave) * 200000)
        console.log(salaryMonth)

        //  lấy session vừa gần nhất để lấy kết thúc
        const checkNow = req.checkinout.map(i => {
            if (i.userId.toString() == emp._id.toString() && i.day == currentDay) {
                return i
            }
        })
        const xCheckNow = checkNow.filter(i => {
            return i !== undefined
        })
        // end
        // lấy session đầu tiên của user này
        const getCheckInOut = req.checkinout.map(i => {
            if (i.userId.toString() == emp._id.toString()) {
                return i
            }
        })
        const xgetCheckInOut = getCheckInOut.filter(i => {
            return i !== undefined
        })
        // end
        res.render('mh_3', {
            pageTitle: "Search Employee info",
            path: '/search',
            prods: emp,
            prod: req.checkinout,
            pro: xCheckNow[0],
            absent: absentSign,
            overTime: totalOvertime,
            salary: salaryMonth,
            startTime: xgetCheckInOut[0].items[0]
        });
    }).catch(err => {
        console.log(err)
    })
}
//#endregion

//#region GET SEACH Employee mh_3 phân trang
exports.getSearchPage = (req, res, next) => {
    const page = +req.query.page || 1;
    const empId = req.session.user._id;
    let managerCheck;
    const ITEMS_PER_PAGE = 2;

    Employee.findById(empId)
        .then(myEmp => {
            // #region lấy manager quản lý emp này
            if (myEmp.isAdmin == true) {
                managerCheck = myEmp
            } else {
                const myManager = req.emp.filter(x => {
                    return x.isAdmin == true && x.empList.filter(y => {
                        return y.empId.toString() == empId._id.toString()
                    });
                });
                managerCheck = myManager[0]
            }
            // #endregion
            CheckInOut.find({ userId: req.session.user._id }).select('items')
                .then(result => {
                    letArray = []
                    for (let i of result) {
                        for (let y of i.items) {
                            letArray.push(y)
                        }
                    }
                    return letArray
                })
                .then(myResult => {
                    function paginate(array, page_size, page_number) {
                        return array.slice((page_number - 1) * page_size, page_number * page_size)
                    }
                    let mything = []
                    console.log(paginate(myResult, ITEMS_PER_PAGE, page))

                    res.render('mh_3Page', {
                        pageTitle: "Search details page",
                        path: "/searchPage",
                        prods: managerCheck,
                        prod: paginate(myResult, ITEMS_PER_PAGE, page),
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < myResult.length,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(myResult.length / ITEMS_PER_PAGE)
                    });
                })

        }).catch(err => {
            console.log(err)
        })

}
// #endregion

//#region POST SEACH Employee mh_3
exports.searchPost = (req, res, next) => {
    const pickMonth = req.body.pickmonth // get pick month
    const empId = req.session.user._id

    Employee.findById(empId).then(emp => {
        // tạo pro để render . là lượt checkinnout vừa rồi

        // start thời gian kết thúc
        let filterEmpCheck = req.checkinout.filter(e => {
            return e.userId.toString() == emp._id.toString() && e.month == currentMonth
        })
        resultFilter = []
        for (let e of filterEmpCheck) {
            if (e.month == pickMonth) {
                resultFilter.push(e)
            } else (
                resultFilter = null
            )
        }
        console.log(resultFilter)
        let getEndday;
        let userEndDay;
        let prodEndDay;
        if (resultFilter !== null) {
            getEndday = resultFilter.slice(-1)
            userEndDay = getEndday[0].items.slice(-1)
            prodEndDay = userEndDay[0].endtime
        } else {
            prodEndDay = null
        }
        // end => prodEndDay

        // start tạo thời gian bắt đầu
        prodCheck = req.checkinout.filter(pr => {
            return pr.userId.toString() == emp._id.toString() && pr.month == currentMonth
        })
        resultprodCheck = []
        for (let p of prodCheck) {
            if (p.month == pickMonth) {
                resultprodCheck.push(p)
            } else {
                resultprodCheck = null
            }
        }
        console.log(resultprodCheck)
        let getStartDay
        let userStartDay
        let prodStartDay
        if (resultprodCheck !== null) {
            getStartDay = resultprodCheck[0]
            userStartDay = getStartDay.items[0]
            prodStartDay = userStartDay.starttime
        }
        else {
            resultprodCheck = null
        }

        // end

        // get all hourLeave in month 
        const hourLeave = (emp.listAbsent.map(i => {
            while (i.dayoff.getMonth() + 1 == pickMonth) {
                if (i.dayoff.getMonth() + 1 == null) {
                    hoursnum = 0;
                }
                let hoursnum = 0;
                return hoursnum += i.hourNum
            }
        }))
        const xHourLeave = hourLeave.filter(x => {
            return x !== undefined
        })
        const totalhourLeave = xHourLeave.reduce((a, b) => {
            return a + b
        }, 0)

        console.log(totalhourLeave + " this is totalhourLeave")
        // ---------  total hourLeave annual in a month
        // get all overtime have in a month
        const getOvertime = (req.checkinout.map(i => {
            while (i.month == pickMonth && i.userId.toString() == emp._id.toString()) {
                if (i.month == null) {
                    overwork = 0;
                }
                let overwork = 0;
                return overwork += i.overTime
            }
        }));
        // tạo filter để bỏ những undefind
        const xGetOvertime = getOvertime.filter(x => {
            return x !== undefined
        })
        const totalOvertime = xGetOvertime.reduce((a, b) => {
            return a + b
        }, 0);
        console.log(totalOvertime + " total Overtime");
        let checkOverTime
        if (resultprodCheck == null) {
            checkOverTime = null
        } else {
            checkOverTime = totalOvertime
        }

        // -- total OverTime get by sum of all day 

        //get all hourworking in day
        const getHour = (req.checkinout.map(i => {
            while (i.month == pickMonth && i.userId.toString() == emp._id.toString()) {
                if (i.month == null) {
                    fullHour = 0;
                }
                let fullHour = 0;
                return fullHour += i.totalHrs
            }
        }))
        const xgetHour = getHour.filter(x => {
            return x !== undefined
        })
        const totalHourWork = xgetHour.reduce((a, b) => {
            return a + b;
        }, 0)
        console.log(totalHourWork + "this is totalHourWork in month");
        // --  total hour working in month

        // tạo số giờ tối thiểu cần thiết trong tháng
        const standardHour = (req.checkinout.map(i => {
            while (i.month == pickMonth && i.userId.toString() == emp._id.toString()) {
                return i.day
            }
        }))
        const xStandardHour = standardHour.filter(x => {
            return x !== undefined
        })
        const standardAMonth = (xStandardHour.length) * 8
        let checkStandard
        if (standardAMonth == 0) {
            checkStandard = null
        }
        console.log(standardAMonth + " số giờ phải làm")
        //tạo salaryMonth
        let salaryMonth
        if (checkStandard !== null) {
            salaryMonth = (emp.salaryScale * 3000000) + ((totalOvertime - (standardAMonth - totalHourWork) + totalhourLeave) * 200000)
        } else {
            salaryMonth = "Không có"
        }
        console.log(salaryMonth)

        res.render("mh_3Status", {
            pageTitle: "Employee Search info",
            path: "/search",
            prods: emp,
            pro: resultFilter,
            pr: resultprodCheck,
            salary: salaryMonth,
            prodTime: checkOverTime,
            userEndTime: prodEndDay,

        })
    }).catch(err => {
        console.log(err)
    })
}
// #endregion

//#region GET COVID mh_4
exports.covid = (req, res, next) => {
    const empId = req.session.user._id

    Employee.find({ _id: empId })
        .then(myEmp => {
            let checkAdmin = myEmp[0].isAdmin

            res.render('mh_4', {
                pageTitle: "Covid Vaccine",
                path: '/covid',
                isAdmin: checkAdmin
            });
        })
        .catch(err => {
            console.log(err)
        })
}
//#endregion

//#region GET COVID Detail mh_4
exports.detailCovid = (req, res, next) => {
    const empId = req.session.user._id
    Employee.find({ _id: empId })
        .then(myEmp => {
            let infoCovid = []
            myStaff = myEmp[0].empList

            infoCovid = req.covi.filter(function (o1) {
                return myStaff.some(function (o2) {
                    return o1.userId.toString() === o2.empId.toString()
                });
            });
            console.log(infoCovid);
            res.render('mh_4detail', {
                pageTitle: "Covid Employee info",
                path: "/detailCovid",
                prods: infoCovid,
                prod: myEmp[0],
            })
        })
        .catch(err => {
            console.log(err)
        })
}
// #endregion

//#region POST Covid mh_4
exports.covidPost = (req, res, next) => {
    const empId = req.session.user._id
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

// #region GET Manager mh_5
exports.managerGet = (req, res, next) => {
    res.render("mh_5", {
        pageTitle: "Manager Site",
        path: "/manager",
    });
}
// #endregion
