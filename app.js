const myHttp = require('http'); // imort a file, hoặc lấy path đến tập tin khác.
const fs = require('fs'); // package được đặg tên là fs .
// fs cho phép ta làm việc với hệ thóng tập tin
// ở đây ta có moudle có sẳn là http,
// có thể nhập file qua nhiều cấp thư mục.
// function rqListener(req,res){
//  có thể tạo một funcion thẳng để dễ nhìn
//  hoặc là một function mũi tên để gọn
// }

const server = myHttp.createServer((req, res) => {
    console.log(req.url, req.method, req.headers); // show request
    //  process.exit(); thoát khỏi quá trình loop, huỷ đăng ký Listener.
    const url = req.url;
    const method = req.method;
    if (url === "/") {
        res.write('<html>');
        res.write('<head><title>Enter</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">SEND</button></input></form></body>');
        res.write('</html>'); //method là POST nên nó sẽ gữi
        return res.end(); // để kết thúc respones,nếu không nó sẽ response lệnh ở dưới tiếp
    }
    if (url === "/message" && method === "POST") {
        fs.writeFileSync("message.txt", "DUMMY"); // tạo tập tin
        // có thể làm với 2 bước điều hướng có status
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end(); // luôn sử dụng kết thức để ngưng lệnh.
        // res.writeHead(302,{
        //     "Content-Type": "text/plain", "/"
        // }); // writeHead cho phép ta viết một số *(meta information) trong một lần và sau đó ta đặt trạng thái code(302,304,300.v.v.) và sau đó ta truyền một object javascript
    }
    res.setHeader('Content-Type', 'text/html'); // set giá trị header 
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js</h1></body>');
    res.write('</html>');
    res.end(); // Sau khi gọi end,không được viết nữa
});

server.listen(3000);