const path = require('path');

const express = require('express');

const rootDir = require('../helper/path');

const router = express.Router(); // tham số Router .

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    // mặc định setHeader của express là text/html
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});
// /admin/add-product => POST
router.post('/add-product', (req, res, next) => { // .get giống như use 
    //có thể xài một path khoặc không nhưng nó chỉ kích hoạt 
    // những request sắp tới. 
    //post cũng tương tự nhưng sẽ làm việc với request post
    //sử dụng get,post,delete,patch,put để lọc chúng,
    products.push({title: req.body.title});
    console.log(req.body);
    res.redirect('/'); // thuộc tính redirec điều hướng route
})

exports.routes = router;
exports.products = products;