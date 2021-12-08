const express = require('express')

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log("In Route shop middleware");
    // mặc định setHeader của express là text/html
    res.send('<h1>Hello From Express</h1>');
});

module.exports = router;