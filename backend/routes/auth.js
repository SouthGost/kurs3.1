const Router = require('express');
const router = new Router();
const authController = require('../controller/auth');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/register', authController.register);
router.post('/register/employee', authController.regEmployee);

module.exports = router;