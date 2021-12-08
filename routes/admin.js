const express = require('express')

const router = express.Router(); // tham số Router .
// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    // mặc định setHeader của express là text/html
    res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});
// /admin/add-product => POST
router.post('/add-product', (req, res, next) => { // .get giống như use 
    //có thể xài một path khoặc không nhưng nó chỉ kích hoạt 
    // những request sắp tới. 
    //post cũng tương tự nhưng sẽ làm việc với request post
    //sử dụng get,post,delete,patch,put để lọc chúng,
    console.log(req.body);
    res.redirect('/'); // thuộc tính redirec điều hướng route
})

module.exports = router;