const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '123456789', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
// dòng đầu là tên database , dòng 2 là id đăng nhập và thứ 3 là password