const path = require('path'); // sử dụng module này 

const productsController = require('../controllers/product');

const express = require('express')


const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;