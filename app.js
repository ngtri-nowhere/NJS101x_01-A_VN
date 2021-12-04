const myHttp = require('http'); // imort a file, hoặc lấy path đến tập tin khác.
// ở đây ta có moudle có sẳn là http,
// có thể nhập file qua nhiều cấp thư mục.
// function rqListener(req,res){
//  có thể tạo một funcion thẳng để dễ nhìn
//  hoặc là một function mũi tên để gọn
// }

const server = myHttp.createServer((req,res) => {
    console.log(req);
});

server.listen(3000);