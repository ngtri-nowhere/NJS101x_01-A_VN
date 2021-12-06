const fs = require('fs');

const requestHandler = (req, res) => {
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
        const body = []; // không thể thây đổi dữ liệu với const
        // nhưng push thì được, nó thây đổi phía sau.
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFile("message.txt", message, (err) => {
                console.log(parseBody);
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end(); // luôn sử dụng kết thức để ngưng lệnh.
            }); // tạo tập tin
            // một dạng đồng bộ.
        });
        // req.on("data"); // req on để nghe các sự kiện
        // kích hoạt bất cứ khi nào một đoạnn mới sẵn sàng được đọc
        // có thể làm với 2 bước điều hướng có status
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
}

module.exports = {
    handler: requestHandler,
    someText: 'Some hard codeed text'
} // xuất file để kết nối
// với cách này ta có thể có nhiều export trong một file.

// module.exports.handler = requestHandler; cũng là một cách .
// expots.handler = requestHandler; // viết tát cũng được phép.
