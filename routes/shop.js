const path = require('path'); // sử dụng module này 

const rootDir = require('../helper/path');
const adminData = require("./admin");

const express = require('express')


const router = express.Router();

router.get('/', (req, res, next) => {

    const products = adminData.products;
    res.render('shop',{prods: products, docTitle: 'Shop'});
});

module.exports = router;