const path = require('path');

const express = require('express');

const rootDir = require('../helper/path');

const productsController = require('../controllers/product');

const router = express.Router(); // tham số Router .


// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);
// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router;
