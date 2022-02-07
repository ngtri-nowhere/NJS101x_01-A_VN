const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//#region login logout mh_6
router.get('/login', authController.logIn) // Get logIn

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], authController.postLogin) // Post logIn

router.post('/logout', authController.postLogout) // Post logOut

//#endregion

module.exports = router;