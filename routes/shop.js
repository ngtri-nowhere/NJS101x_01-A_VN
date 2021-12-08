const path = require('path'); // sử dụng module này 

const express = require('express')

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log("In Route shop middleware");
    // mặc định setHeader của express là text/html
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html')); //join đường dẫn. 
    //với mãng đầu __dirname là chỉ đường dẫn thư mục project
    // mãng sau là thu mục mình muốn sử dung , và mãng sau là file của chúng ta sử dung.
    //  res.sendFile('./views/shop.html');// nó sẽ không hiêu vì đây là đường dẫn hệ thống.
});

module.exports = router;