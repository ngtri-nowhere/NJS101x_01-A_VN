const mysql = require('mysq12');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '123456789'
});

module.exports = pool.promise();