const express = require('express');

const checkingController = require('../controllers/checkin');
const { body } = require('express-validator/check');
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
//#endgion

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
//Post => Search
router.post('/search', checkingController.searchPost);
//#endregion

//#region Covid mh_4
//Get Covid
router.get('/covid', isAuth, checkingController.covid);
//Post Covid 
router.post('/covid', checkingController.covidPost);
//#endregion

//#region Manager mh_5
router.get('/manager', isAuth, checkingController.managerGet);

//#endregion

module.exports = router;