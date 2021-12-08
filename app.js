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

const server = myHttp.createServer(app);

server.listen(3000);