const Router = require('express');
const router = new Router();
const authController = require('../controller/auth');

// router.get('/', authController.getEmployees);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/register', authController.register);
router.post('/register/employee', authController.regEmployee);
// router.delete('/delete/', employeeController.deleteEmployee);

module.exports = router;