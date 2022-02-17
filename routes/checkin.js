const express = require('express');

const checkingController = require('../controllers/checkin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/', isAuth, checkingController.mh1);

//#region Checkin --get post mh_1
router.get('/checkIn', isAuth, checkingController.checkIn);
router.post('/checkIn', checkingController.checkinPost);
// #endregion

//#region Get post info checkout mh_1
router.get('/checkOut', isAuth, checkingController.checkOut);
router.post('/checkOut', checkingController.checkOutPost);
//#endregion

//#region Get Post absent mh_1
router.get('/absent', isAuth, checkingController.absent);
router.post('/absent', checkingController.absentPost);
//#endregion

//#region Edit Post Edit Img mh_2
router.get('/edit', isAuth, checkingController.edit);
//Get Edit IMG
router.get('/addNew/:employeeId', isAuth, checkingController.getEditImg);
//Post img edit
router.post('/addNew', checkingController.postEditEmployee);
//#endregion

//#region Search mh_3
//Get Search
router.get('/search', isAuth, checkingController.search);
// Get Search Page
router.get('/searchPage', isAuth, checkingController.getSearchPage);
//Post => Search
router.post('/search', checkingController.searchPost);
//#endregion

//#region Covid mh_4
//Get Covid
router.get('/covid', isAuth, checkingController.covid);
//Get Covid More InFo
router.get('/detailCovid', isAuth, checkingController.detailCovid);
//Get Covid More InFo Invoice
router.get('/detailCovid/:covidUser', isAuth, checkingController.getInvoice);
//Post Covid 
router.post('/covid', checkingController.covidPost);
//#endregion

//#region Manager mh_5
router.get('/manager', isAuth, checkingController.managerGet); // màn hình chính trang 5
router.get('/managerError', isAuth, checkingController.managerGet); // lỗi không phải manager
router.get('/manager/:staffId', isAuth, checkingController.getStaff); // list nhân viên
router.get('/checkList/:checkId', isAuth, checkingController.getListCheck); // list phiên
router.post('/delete-item', isAuth, checkingController.postDeleteCheck); // delete phiên
router.post('/managerGetMonth', isAuth, checkingController.postPickMonth) // get month nhân viên
router.post('/managerAproved', isAuth, checkingController.postAproved) // Post unAproved nhân viên
//#endregion

module.exports = router;