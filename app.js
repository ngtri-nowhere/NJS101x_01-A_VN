const myHttp = require('http'); // imort a file, hoặc lấy path đến tập tin khác.
// ở đây ta có moudle có sẳn là http,
// có thể nhập file qua nhiều cấp thư mục.
// function rqListener(req,res){
//  có thể tạo một funcion thẳng để dễ nhìn
//  hoặc là một function mũi tên để gọn
// }

const server = myHttp.createServer((req, res) => {
    console.log(req.url, req.method, req.headers); // show request
    //  process.exit(); thoát khỏi quá trình loop, huỷ đăng ký Listener.
    res.setHeader('Content-Type', 'text/html'); // set giá trị header 
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js</h1></body>');
    res.write('</html>');
    res.end(); // Sau khi gọi end,không được viết nữa
});

server.listen(3000);