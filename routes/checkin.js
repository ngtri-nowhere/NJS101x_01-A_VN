const express = require('express');

const checkingController = require('../controllers/checkin');

const router = express.Router();
//Get Checkin
router.get('/', checkingController.checkIn);
//Post info checkin
router.post('/', checkingController.checkinPost);
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