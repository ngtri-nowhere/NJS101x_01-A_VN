const express = require('express');

const checkingController = require('../controllers/checkin');

const router = express.Router();

router.get('/', checkingController.mh1);

//#region mh_1
//Get Checkin
router.get('/checkIn', checkingController.checkIn);
//Post info checkin
router.post('/checkIn', checkingController.checkinPost);
//Get info checkout
router.get('/checkOut', checkingController.checkOut);
//Post info checkin-Status
router.post('/checkOut', checkingController.checkOutPost);
//Get absent
router.get('/absent', checkingController.absent);
//Post absent 
router.post('/absent', checkingController.absentPost);
//#endregion

//#region mh_2
//Get Edit
router.get('/edit', checkingController.edit);
//Get Edit IMG
router.get('/addNew/:employeeId', checkingController.getEditImg);
//Post Edit Img
router.post('/addNew', checkingController.postEditEmployee);
//#endregion

//#region mh_3
//Get Search
router.get('/search', checkingController.search);
//Post => Search
router.post('/search', checkingController.searchPost);
//Post Wildcard 
router.post('/wildCard', checkingController.postWildCard);
//#endregion

//#region mh_4
//Get Covid
router.get('/covid', checkingController.covid);
//Post Covid 
router.post('/covid', checkingController.covidPost);
//#endregion

module.exports = router;