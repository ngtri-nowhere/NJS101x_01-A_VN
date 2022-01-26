const express = require('express');

const checkingController = require('../controllers/checkin');

const router = express.Router();

router.get('/', checkingController.mh1);

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
//Get Edit
router.get('/edit', checkingController.edit);
//Get Edit IMG
router.get('/addNew/:employeeId', checkingController.getEditImg);
//Post Edit Img
router.post('/addNew', checkingController.postEditEmployee);

//Get Search
router.get('/search', checkingController.search);
//Get Covid
router.get('/covid', checkingController.covid);
//Post Covid 
router.post('/covid', checkingController.covidPost);


module.exports = router;