const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // mặc định setHeader của express là text/html
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        activeProduct: true,
        productCSS: true,
    });
};

exports.postAddProduct = (req, res, next) => { // .get giống như use 
    //có thể xài một path khoặc không nhưng nó chỉ kích hoạt 
    // những request sắp tới. 
    //post cũng tương tự nhưng sẽ làm việc với request post
    //sử dụng get,post,delete,patch,put để lọc chúng,
    const product = new Product(req.body.title);
    product.save();
    console.log(req.body);
    res.redirect('/'); // thuộc tính redirec điều hướng route
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll();;
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    });
}
