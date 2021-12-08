//const myHttp = require('http'); // imort a file, hoặc lấy path đến tập tin khác.
// package được đặg tên là fs .
// fs cho phép ta làm việc với hệ thóng tập tin
// ở đây ta có moudle có sẳn là http,
// có thể nhập file qua nhiều cấp thư mục.
// function rqListener(req,res){
//  có thể tạo một funcion thẳng để dễ nhìn
//  hoặc là một function mũi tên để gọn
// }
// vì ta nhập vào không phải là một module toàn cục.
// nên cần chỉ rõ đường dẫn. đây là một lõi file tuỳ chĩnh

const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // express là một hàm ở đây
// thuộc tính use của express cho ta thêm một hàm trung gian mới
// app.use((req, res, next) => {
//     console.log("In the middleware");
//     next();//next cho phép request được tiếp tục đến middleware tiếp theo
// });
app.use(bodyParser.urlencoded({ extended: false })) // nên tắt mặc định

app.use('/', (req, res, next) => {
    console.log("This is first middleware,and it always runs");
    next();
});

app.use('/add-product', (req, res, next) => {
    // mặc định setHeader của express là text/html
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

app.post('/product', (req, res, next) => { // .get giống như use 
    //có thể xài một path khoặc không nhưng nó chỉ kích hoạt 
    // những request sắp tới. 
    //post cũng tương tự nhưng sẽ làm việc với request post
    //sử dụng get,post,delete,patch,put để lọc chúng,
    console.log(req.body);
    res.redirect('/'); // thuộc tính redirec điều hướng route
})

app.use('/', (req, res, next) => {
    console.log("In last middleware");
    // mặc định setHeader của express là text/html
    res.send('<h1>Hello From Express</h1>');
});

app.listen(3000)
// const server = myHttp.createServer(app);

// server.listen(3000);