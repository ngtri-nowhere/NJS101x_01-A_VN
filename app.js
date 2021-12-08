const myHttp = require('http'); // imort a file, hoặc lấy path đến tập tin khác.
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
const app = express();
// thuộc tính use của express cho ta thêm một hàm trung gian mới
app.use((req, res, next) => {
    console.log("In the middleware");
    next();//next cho phép request được tiếp tục đến middleware tiếp theo
});
app.use((req, res, next) => {
    console.log("In another middleware");
    // mặc định setHeader của express là text/html
    res.send('<h1>Hello From Express</h1>');
});


const server = myHttp.createServer(app);

server.listen(3000);