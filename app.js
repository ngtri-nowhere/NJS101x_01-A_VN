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

const path = require('path');

const app = express(); // express là một hàm ở đây
// thuộc tính use của express cho ta thêm một hàm trung gian mới
// app.use((req, res, next) => {
//     console.log("In the middleware");
//     next();//next cho phép request được tiếp tục đến middleware tiếp theo
// });
const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false })) // nên tắt mặc định

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000)
// const server = myHttp.createServer(app);

// server.listen(3000);